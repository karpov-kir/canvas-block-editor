import { Command } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RenderCommand } from './RenderCommand';
import { RenderService } from './RenderService';

export class RenderedEvent extends Event {}

export class RenderCommandHandler extends Command {
  constructor(private readonly renderService: RenderService, private readonly eventBus: EventBus) {
    super();
  }

  execute(_command: RenderCommand) {
    this.renderService.render();
    this.eventBus.publish(new RenderedEvent());
  }
}
