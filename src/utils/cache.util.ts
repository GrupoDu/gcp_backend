import NodeCache from "node-cache";

class CreateCache {
  private static cacheInstance: NodeCache;

  static getCacheInstance(): NodeCache {
    if (!CreateCache.cacheInstance) {
      CreateCache.cacheInstance = new NodeCache({
        stdTTL: 600,
        checkperiod: 120,
        useClones: true,
      });
    }

    return CreateCache.cacheInstance;
  }
}

export const cacheInstance = CreateCache.getCacheInstance();
