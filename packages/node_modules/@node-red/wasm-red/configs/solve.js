export default function solve () {
    return {
      async writeBundle(meta, content) {
        console.log('handle', content);
        content['wasm-red.bd9edb973363d64c1073e9ad5bbecdd2.bundle.inner.js'].code = content['wasm-red.bd9edb973363d64c1073e9ad5bbecdd2.bundle.inner.js'].code.replace("global.", "commonjsGlobal.")
        return content
      },
    };
  }
  