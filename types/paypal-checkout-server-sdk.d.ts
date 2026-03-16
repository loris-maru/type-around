declare module "@paypal/checkout-server-sdk" {
  export namespace core {
    class SandboxEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
    class LiveEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
    class PayPalHttpClient {
      constructor(
        environment: SandboxEnvironment | LiveEnvironment
      );
      execute<T>(request: unknown): Promise<{
        statusCode: number;
        result: T;
      }>;
    }
  }
  export namespace orders {
    class OrdersCreateRequest {
      prefer(value: string): void;
      requestBody(body: object): void;
    }
    class OrdersGetRequest {
      constructor(orderId: string);
    }
    class OrdersCaptureRequest {
      constructor(orderId: string);
      requestBody(body: object): void;
    }
  }
  const paypal: {
    core: typeof core;
    orders: typeof orders;
  };
  export = paypal;
}
