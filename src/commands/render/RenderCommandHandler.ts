import { Command } from '../../utils/Command';
import { RenderCommand } from './RenderCommand';
import { RenderService } from './RenderService';

export class RenderCommandHandler extends Command {
  constructor(private readonly renderService: RenderService) {
    super();
  }

  execute(_command: RenderCommand) {
    this.renderService.render();
  }
}
