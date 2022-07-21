import {
  DaiToken as DaiTokenContract,
  Transfer as TransferEvent,
} from "../generated/DaiToken/DaiToken";
import { User, TokenTransfered, TokenReceived } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let receiverUser = User.load(event.params.dst.toHex());
  let sourceUser = User.load(event.params.src.toHex());

  //load the contract and find the balance as at that point int time
  let Contract = DaiTokenContract.bind(event.address);
  let receiverBalance = Contract.balanceOf(event.params.dst);
  let sourceBalance = Contract.balanceOf(event.params.src);

  if (!receiverUser) {
    //create a new receiver here
    receiverUser = new User(event.params.dst.toHex());
    receiverUser.save();
  }

  if (!sourceUser) {
    sourceUser = new User(event.params.src.toHex());
    sourceUser.save();
  }

  let timeStamp = event.block.timestamp;

  let userReceiving = new TokenReceived(
    event.transaction.from.toHex().concat(event.params.dst.toHex())
  );
  userReceiving.amount = event.params.wad;
  userReceiving.from = event.params.src.toHex();
  userReceiving.timeStamp = timeStamp;
  userReceiving.receiverCurrentAmount = receiverBalance;
  userReceiving.save();

  let userSending = new TokenTransfered(
    event.transaction.from.toHex().concat(event.params.src.toHex())
  );

  userSending.amount = event.params.wad;
  userSending.to = event.params.dst.toHex();
  userSending.timeStamp = timeStamp;
  userSending.senderCurrentAmount = sourceBalance;
  userSending.save();
}

