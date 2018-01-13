import { ApplicationRef, NgModuleRef } from '@angular/core';
import { enableDebugTools } from '@angular/platform-browser';
import { Environment } from './model';

Error.stackTraceLimit = Infinity;
import 'zone.js/dist/long-stack-trace-zone';

export const environment: any = {
  production: false,
  host: 'http://localhost:7776',
  apiPath: 'api',
  tokenKey: 'token',
  defaultDate: '1994-08-29',

  /** Angular debug tools in the dev console
   * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
   * @param modRef
   * @return {any}
   */
  decorateModuleRef(modRef: NgModuleRef<any>) {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    const win = window as any;

    const _ng = win.ng;
    enableDebugTools(cmpRef);
    win.ng.probe = _ng.probe;
    win.ng.coreTokens = _ng.coreTokens;
    return modRef;
  },
  ENV_PROVIDERS: [

  ]
};
