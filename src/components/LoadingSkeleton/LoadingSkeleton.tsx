import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function LoadingSkeleton() {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <Skeleton count={5} height="4rem" />
    </SkeletonTheme>
  )
}
export default LoadingSkeleton