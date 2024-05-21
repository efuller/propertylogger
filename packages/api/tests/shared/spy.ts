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

  toHaveBeenCalledBy(methodName: string, calledBy: string) {
    if (!this.calls[methodName]) {
      return false;
    }
    return this.calls[methodName].some((call) => call.calledBy === calledBy);
  }
}

