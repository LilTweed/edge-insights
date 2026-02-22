import { useParams, Link } from "react-router-dom";

const PlayerDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container py-12 text-center">
      <p className="text-muted-foreground">Player data not available</p>
      <Link to="/players" className="mt-2 inline-block text-sm text-primary underline">Back to players</Link>
    </div>
  );
};

export default PlayerDetailPage;
