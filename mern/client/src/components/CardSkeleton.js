import Skeleton from "react-loading-skeleton";
import "./SkeletonCard.css";

const CardSkeleton = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((item) => (
      <div className="card-skeleton">
        <div className="small-initials-container">
          <Skeleton circle />
        </div>
        <div className="inside-post-container">
          <Skeleton count={2} />
        </div>
        <div className="inside-post-comment">
          <Skeleton />
        </div>
      </div>
    ));
};

export default CardSkeleton;
