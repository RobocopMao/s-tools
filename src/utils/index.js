
import { useEffect, DependencyList } from '@tarojs/taro'

export function useAsyncEffect (effect, deps = DependencyList) {
  useEffect(() => {
    effect()
  }, deps)
}
