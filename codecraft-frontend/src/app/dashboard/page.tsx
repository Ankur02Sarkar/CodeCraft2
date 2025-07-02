import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Code Snippets</h3>
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-500">Total generated</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Projects</h3>
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-500">Active projects</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Templates</h3>
            <p className="text-2xl font-bold text-purple-600">12</p>
            <p className="text-sm text-gray-500">Available templates</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-medium">New Project</div>
              <div className="text-sm text-gray-500">Start a new AI project</div>
            </button>

            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="text-2xl mb-2">🧩</div>
              <div className="font-medium">Generate Code</div>
              <div className="text-sm text-gray-500">Create code snippets</div>
            </button>

            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-medium">Browse Templates</div>
              <div className="text-sm text-gray-500">Explore code templates</div>
            </button>

            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="font-medium">Settings</div>
              <div className="text-sm text-gray-500">Customize your experience</div>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>No recent activity</p>
            <p className="text-sm">Start creating to see your activity here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
