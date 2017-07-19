

export abstract class CoreService {
  protected webServiceEndpoint: string;
  private static debugEndpoint: string = 'http://localhost:8080/';

  constructor() {
    this.webServiceEndpoint = CoreService.debugEndpoint;
  }

}
