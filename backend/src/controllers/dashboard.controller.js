import { User } from "../models/User.js";

export async function getDashboard(req, res) {
  const user = req.user;
  const mode = getMode(req, user);

  if (mode === "admin") {
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    return res.json({
      mode,
      dashboardTitle: "Admin Panel",
      user: toDashboardUser(user),
      summary: {
        users: totalUsers,
        admins: totalAdmins,
        listings: 0,
        returns: 0,
        recycled: 0,
        disputes: 0,
      },
      sections: {
        modules: [],
        alerts: [],
        reports: [],
      },
    });
  }

  if (mode === "seller") {
    return res.json({
      mode,
      dashboardTitle: "Seller Dashboard",
      user: toDashboardUser(user),
      summary: {
        activeListings: 0,
        orders: 0,
        returns: 0,
        revenueRecovered: 0,
        rating: 0,
        greenCredits: 0,
      },
      sections: {
        listings: [],
        returnReasons: [],
        insights: [],
        nudges: [],
      },
    });
  }

  res.json({
    mode,
    dashboardTitle: "Buyer Dashboard",
    user: toDashboardUser(user),
    summary: {
      orders: 0,
      activeMatches: 0,
      pendingReturns: 0,
      coupons: 0,
      greenCredits: 0,
      savedItems: 0,
    },
    sections: {
      nearbyDemand: [],
      nudges: [],
      rewards: [],
      recentOrders: [],
    },
  });
}

function getMode(req, user) {
  if (user.role === "admin") return "admin";
  return req.query.mode === "seller" ? "seller" : "buyer";
}

function toDashboardUser(user) {
  return {
    name: user.name,
    email: user.email,
    role: user.role === "admin" ? "admin" : "user",
    location: user.profile?.location?.label || "",
  };
}
