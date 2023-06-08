import { RemoveSelectionFromBlockCommand } from '../../../commands/removeSelectionFromBlock/RemoveSelectionFromBlockCommand';
import { BlockStore } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionUnselectEvent } from '../CursorInteractionMediator';

export function unselectHandler(event: CursorInteractionUnselectEvent, blockStore: BlockStore, commandBus: CommandBus) {
  blockStore.blocksWithSelection.forEach((block) => {
    commandBus.publish(new RemoveSelectionFromBlockCommand(block.id));
  });
}
