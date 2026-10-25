import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';

export async function loadBrowserModule(filename, html = '', mocks = {}, globals = {}) {
  const { window } = parseHTML(`<html><body>${html}</body></html>`);
  const alerts = [];
  const media = { matches: false, addEventListener() {} };
  window.matchMedia = () => media;
  window.location = { hash: '' };
  const context = vm.createContext({
    document: window.document, window, URL, console,
    CustomEvent: window.CustomEvent,
    requestAnimationFrame: (callback) => callback(),
    fetch: async () => ({ ok: true, json: async () => ({ enabled: false }) }),
    alert: (message) => alerts.push(message),
    ...globals,
  });
  const modules = new Map();
  async function load(name) {
    if (modules.has(name)) return modules.get(name);
    let module;
    if (mocks[name]) {
      const values = mocks[name];
      module = new vm.SyntheticModule(Object.keys(values), function () {
        for (const [key, value] of Object.entries(values)) this.setExport(key, value);
      }, { context, identifier: name });
    } else {
      module = new vm.SourceTextModule(await readFile(name, 'utf8'), {
        context, identifier: name,
        initializeImportMeta(meta) { meta.url = pathToFileURL(name).href; },
        importModuleDynamically: async (specifier, parent) => {
          const child = await load(resolveImport(specifier, parent.identifier));
          if (child.status === 'unlinked') await child.link(linker);
          if (child.status !== 'evaluated') await child.evaluate();
          return child;
        },
      });
    }
    modules.set(name, module);
    return module;
  }
  const resolveImport = (specifier, parent) => specifier.startsWith('.') ? resolve(parent, '..', specifier) : specifier;
  const linker = (specifier, parent) => load(resolveImport(specifier, parent.identifier));
  const entry = await load(resolve(filename));
  await entry.link(linker);
  await entry.evaluate();
  return { exports: entry.namespace, window, document: window.document, alerts, media };
}
