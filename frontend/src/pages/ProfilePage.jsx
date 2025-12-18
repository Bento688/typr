import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import {
  Loader2,
  User,
  Trophy,
  Zap,
  Target,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch History on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/results/history");
        setResults(res.data);
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) fetchHistory();
  }, [authUser]);

  if (isCheckingAuth || loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-4">
        <h2 className="text-2xl font-bold">
          Please log in to view your profile
        </h2>
      </div>
    );
  }

  // Calculate Stats
  const totalTests = results.length;
  const bestWpm = results.reduce((max, r) => (r.wpm > max ? r.wpm : max), 0);
  const avgWpm =
    totalTests > 0
      ? Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / totalTests)
      : 0;

  // Format Data for Chart
  // We add 'index' to ensure every point is unique on the X-Axis
  const chartData = [...results].reverse().map((r, i) => ({
    index: i, // Unique ID for XAxis
    date: new Date(r.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    fullDate: new Date(r.date).toLocaleString(), // Detailed date for Tooltip
    wpm: r.wpm,
    raw: r.rawWpm,
  }));

  return (
    <div className="min-h-screen pt-5 pb-10 px-4 max-w-6xl mx-auto">
      {/* Back button */}
      <Link to="/" className="justify-between">
        <div className="mb-5 flex gap-2 items-center text-primary hover:text-base-content">
          <p>
            <ArrowLeft className="w-4 h-4" />
          </p>
          <p>back to typing</p>
        </div>
      </Link>

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 ring ring-primary ring-offset-base-100 ring-offset-2">
            {authUser.avatar ? (
              <img src={authUser.avatar} alt="avatar" />
            ) : (
              <span className="text-3xl font-bold uppercase">
                {authUser.username?.[0]}
              </span>
            )}
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{authUser.username}</h1>
          <p className="text-base-content/60 flex items-center justify-center md:justify-start gap-2 mt-1">
            <Calendar className="w-4 h-4" />
            Joined {new Date(authUser.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="stat bg-base-200 shadow rounded-xl">
          <div className="stat-figure text-primary">
            <Zap className="w-8 h-8" />
          </div>
          <div className="stat-title">Average Speed</div>
          <div className="stat-value text-primary">{avgWpm} WPM</div>
          <div className="stat-desc">All time average</div>
        </div>

        <div className="stat bg-base-200 shadow rounded-xl">
          <div className="stat-figure text-secondary">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="stat-title">Best Speed</div>
          <div className="stat-value text-secondary">{bestWpm} WPM</div>
          <div className="stat-desc">Personal record</div>
        </div>

        <div className="stat bg-base-200 shadow rounded-xl">
          <div className="stat-figure text-accent">
            <Target className="w-8 h-8" />
          </div>
          <div className="stat-title">Tests Taken</div>
          <div className="stat-value text-accent">{totalTests}</div>
          <div className="stat-desc">Total completed tests</div>
        </div>
      </div>

      {/* 3. Chart Section */}
      {totalTests > 0 && (
        <div className="card bg-base-200 shadow-xl mb-10 p-6">
          <h3 className="text-xl font-bold mb-6">Progress Over Time</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

                {/* XAxis uses unique index but displays the date */}
                <XAxis
                  dataKey="index"
                  stroke="currentColor"
                  opacity={0.5}
                  tick={{ fill: "currentColor", opacity: 0.7 }}
                  tickFormatter={(i) => chartData[i]?.date || ""}
                />

                <YAxis
                  stroke="currentColor"
                  opacity={0.5}
                  tick={{ fill: "currentColor", opacity: 0.7 }}
                  domain={["dataMin - 5", "dataMax + 5"]} // Adds some breathing room
                />

                <Tooltip
                  cursor={{
                    stroke: "oklch(var(--bc))",
                    strokeOpacity: 0.2,
                    strokeWidth: 2,
                  }}
                  contentStyle={{
                    backgroundColor: "oklch(var(--b1))",
                    borderColor: "oklch(var(--b3))",
                    borderRadius: "8px",
                    color: "oklch(var(--bc))",
                  }}
                  itemStyle={{ color: "oklch(var(--p))" }}
                  // Convert the index back to a readable date for the header
                  labelFormatter={(i) => chartData[i]?.fullDate || ""}
                />

                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="oklch(var(--p))"
                  strokeWidth={3}
                  activeDot={{
                    r: 8,
                    className: "fill-primary stroke-base-100 stroke-2",
                  }}
                  dot={{
                    r: 5,
                    className: "fill-base-100 stroke-primary stroke-2",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. History Table */}
      <div className="card bg-base-200 shadow-xl overflow-hidden">
        <div className="overflow-auto max-h-100">
          <table className="table table-zebra w-full">
            <thead className="sticky top-0 bg-base-300 z-10">
              <tr className="bg-base-300">
                <th>Date</th>
                <th>WPM</th>
                <th>Raw</th>
                <th>Accuracy</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result._id} className="hover">
                  <td className="opacity-70">
                    {new Date(result.date).toLocaleDateString()}
                    <br />
                    <span className="text-xs opacity-50">
                      {new Date(result.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="font-bold text-primary text-lg">
                    {result.wpm}
                  </td>
                  <td className="opacity-70">{result.rawWpm}</td>
                  <td>
                    <div className="badge badge-outline">
                      {result.accuracy}%
                    </div>
                  </td>
                  <td className="uppercase text-xs font-bold opacity-60">
                    {result.testType.replace("_", " ")}
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 opacity-50">
                    No tests taken yet. Start typing to see your history!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
