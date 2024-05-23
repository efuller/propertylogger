export type Call = {
  params?: unknown[];
  calledBy?: string;
}

// TODO: Utilize this class for other spy's in the codebase
export abstract class Spy {
  calls: Record<string, Call[]> = {};

  addCall(methodName: string, data: Call) {
    if (!this.calls[methodName]) {
      this.calls[methodName] = [{ ...data }];
      return;
    }
    this.calls[methodName].push({ ...data });
  }

  timesCalled(methodName: string) {
    if (!this.calls[methodName]) {
      return 0;
    }
    return this.calls[methodName].length;
  }

  toHaveBeenCalledWith(methodName: string, params: unknown[]) {
    if (!this.calls[methodName]) {
      return false;
    }

    const paramsNotCalled: unknown[] = [];

    const result = params.every((param, index) => {

      const someResult = this.calls[methodName].some((call) => {
        if (!call.params) {
          return false;
        }
        const wasItCalled = call.params[index] === param;

        if (!wasItCalled) {
          paramsNotCalled.push(param);
        }
        return wasItCalled;
      });

      if (!someResult) {
        paramsNotCalled.forEach((param) => {
          console.log(`Expected ${methodName} to be called with ${params}, but ${param} was not called`);
        });
      }

      return someResult;
    });

    return result;
  }

  toHaveBeenCalledBy(methodName: string, calledBy: string) {
    if (!this.calls[methodName]) {
      return false;
    }
    return this.calls[methodName].some((call) => call.calledBy === calledBy);
  }
}

