import { BigInt } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/DaiToken/DaiToken";
import { User, UserCounter, TransferCounter } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  
  let day = event.block.timestamp.div(BigInt.fromI32(60 * 60 * 24));

  let userFrom = User.load(event.params.src.toHex());
  if (userFrom == null) {
    userFrom = newUser(event.params.src.toHex(), event.params.src.toHex());
  }
  userFrom.balance = userFrom.balance.minus(event.params.wad);
  userFrom.transactionCount = userFrom.transactionCount + 1;
  userFrom.save();

  let userTo = User.load(event.params.dst.toHex());
  if (userTo == null) {
    userTo = newUser(event.params.dst.toHex(), event.params.dst.toHex());

    // UserCounter
    let userCounter = UserCounter.load("singleton");
    if (userCounter == null) {
      userCounter = new UserCounter("singleton");
      userCounter.count = 1;
    } else {
      userCounter.count = userCounter.count + 1;
    }
    userCounter.save();
    userCounter.id = day.toString();
    userCounter.save();
  }
  userTo.balance = userTo.balance.plus(event.params.wad);
  userTo.transactionCount = userTo.transactionCount + 1;
  userTo.save();

  // Transfer counter total and historical
  let transferCounter = TransferCounter.load("singleton");
  if (transferCounter == null) {
    transferCounter = new TransferCounter("singleton");
    transferCounter.count = 0;
    transferCounter.totalTransferred = BigInt.fromI32(0);
  }
  transferCounter.count = transferCounter.count + 1;
  transferCounter.totalTransferred = transferCounter.totalTransferred.plus(
    event.params.wad
  );
  transferCounter.save();
  transferCounter.id = day.toString();
  transferCounter.save();
}

function newUser(id: string, address: string): User {
  let user = new User(id);
  user.address = address;
  user.balance = BigInt.fromI32(0);
  user.transactionCount = 0;
  return user;
}
