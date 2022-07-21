import {
  DaiToken as DaiTokenContract,
  Transfer as TransferEvent,
} from "../generated/DaiToken/DaiToken";
import { User, TokenHeld } from "../generated/schema";

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

  let sourceTokenHeld = new TokenHeld(
    event.transaction.from.toHex().concat(event.params.src.toHex())
  );

  sourceTokenHeld.amount = event.params.wad;
  sourceTokenHeld.currentValue = sourceBalance;
  sourceTokenHeld.receiverAccount = event.params.dst.toHex();
  sourceTokenHeld.sourceAccount = event.params.src.toHex();
  sourceTokenHeld.timeStamp = timeStamp;
  sourceTokenHeld.save();

  let receiverTokenHeld = new TokenHeld(
    event.transaction.from.toHex().concat(event.params.dst.toHex())
  );

  receiverTokenHeld.amount = event.params.wad;
  receiverTokenHeld.currentValue = receiverBalance;
  receiverTokenHeld.receiverAccount = event.params.dst.toHex();
  receiverTokenHeld.sourceAccount = event.params.src.toHex();
  receiverTokenHeld.timeStamp = timeStamp;
  receiverTokenHeld.save();
}
