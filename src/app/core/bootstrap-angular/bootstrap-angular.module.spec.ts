import { BootstrapAngularModule } from './bootstrap-angular.module';

describe('BootstrapAngularModule', () => {
  let bootstrapAngularModule: BootstrapAngularModule;

  beforeEach(() => {
    bootstrapAngularModule = new BootstrapAngularModule();
  });

  it('should create an instance', () => {
    expect(bootstrapAngularModule).toBeTruthy();
  });
});
