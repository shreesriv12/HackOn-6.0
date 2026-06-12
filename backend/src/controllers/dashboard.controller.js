export async function getDashboard(req, res) {
  const user = req.user;
  const baseDashboard = {
    user: {
      name: user.name,
      role: user.role,
      location: user.profile?.location?.label || "Set location",
    },
    roleHome: roleHome(user.role),
    dashboardTitle: roleTitle(user.role),
    onboardingTour: [
      "Here's how to list a product",
      "Here's how returns work",
      "Here's how you earn rewards",
    ],
  };

  if (user.role === "admin") {
    return res.json({
      ...baseDashboard,
      summary: {
        totalUsers: 12840,
        totalListings: 3420,
        transactionsToday: 284,
        returnsInitiated: 91,
        productsRecycled: 442,
        commissionEarned: "₹2.8L",
      },
      adminModules: [
        { name: "User Management", status: "128 suspended checks pending" },
        { name: "Listing Management", status: "36 suspicious listings flagged" },
        { name: "Return Management", status: "14 AI grading overrides requested" },
        { name: "Recycle Centers", status: "8 centers near capacity" },
        { name: "Reward Rules", status: "Green credit multiplier active" },
      ],
      alerts: [
        "Fraud monitor flagged repeated damaged-product uploads",
        "NGO donation report is ready for export",
        "Carbon saved dashboard crossed this week's target",
      ],
    });
  }

  if (user.role === "seller") {
    return res.json({
      ...baseDashboard,
      summary: {
        activeListings: 18,
        totalSalesThisMonth: 64,
        returnRate: "11%",
        revenueRecovered: "₹84K",
        loyaltyTier: "Gold",
        greenCredits: 1260,
      },
      sellerInsights: [
        "68% buyers expected a darker color than your listing photos show",
        "Add side-view photos to reduce expectation mismatch",
        "Your size chart is inaccurate for 40% of returners",
      ],
      returnReasons: [
        { reason: "Did not match expectation", count: 42 },
        { reason: "Wrong size", count: 31 },
        { reason: "Minor defect", count: 9 },
      ],
      proactiveNudges: [
        "Fix 3 listings today to unlock a lower commission tier",
        "Two returned products can be relisted as Like New",
      ],
    });
  }

  res.json({
    ...baseDashboard,
    summary: {
      activeListings: 4,
      ongoingMatches: 5,
      pendingReturns: 2,
      coupons: 3,
      greenCredits: 840,
    },
    nearbyDemand: [
      { product: "Baby monitor", distance: "1.2 km", peopleWaiting: 5, matchScore: 94 },
      { product: "Running shoes", distance: "2.4 km", peopleWaiting: 3, matchScore: 86 },
      { product: "Winter jacket", distance: "3.1 km", peopleWaiting: 7, matchScore: 81 },
    ],
    proactiveNudges: [
      "Your baby monitor - 5 people nearby want it",
      "Your winter jacket may be ready to pass on before the season starts",
      "Listing your unused shoes today can unlock green credits",
    ],
  });
}

function roleHome(role) {
  if (role === "admin") return "/admin";
  if (role === "seller") return "/seller";
  return "/dashboard";
}

function roleTitle(role) {
  if (role === "admin") return "Admin Panel";
  if (role === "seller") return "Seller Dashboard";
  return "User Dashboard";
}
