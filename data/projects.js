/* ==========================================================================
   data/projects.js
   Edit this file to add, remove or change portfolio projects.
   Each project object is rendered automatically into a 3D project card
   inside the Projects section by js/main.js -> renderProjects().

   To add a new project: copy one object below, edit the fields, and add
   it to the projects array. No other file needs to change.
   ========================================================================== */

const PROJECTS = [
  {
    id: "banking-data-analysis",
    number: "01",
    title: "Banking Data Analysis",
    tools: ["SQL", "Power BI", "Excel"],
    description:
      "Analyze customer accounts, transactions, loans and banking performance to identify business insights.",
    features: [
      "Customer Analysis",
      "Transaction Analysis",
      "Loan Analysis",
      "Account Analysis",
      "KPI Dashboard",
      "Financial Insights",
    ],
    metric: { label: "Loan default patterns", value: "flagged" },
    links: {
      view: "#",
      github: "https://github.com/your-username/banking-data-analysis",
    },
  },
  {
    id: "netflix-data-analysis",
    number: "02",
    title: "Netflix Data Analysis",
    tools: ["SQL", "Python", "Excel", "Power BI"],
    description:
      "Analyze Netflix movies and TV shows to discover trends across genres, countries, ratings, release years and content types.",
    features: [
      "Movies vs TV Shows",
      "Genre Analysis",
      "Country Analysis",
      "Release Trends",
      "Rating Analysis",
      "Content Distribution",
    ],
    metric: { label: "Titles analyzed", value: "8,800+" },
    links: {
      view: "#",
      github: "https://github.com/your-username/netflix-data-analysis",
    },
  },
  {
    id: "marketing-campaign-analytics",
    number: "03",
    title: "Marketing Campaign Analytics",
    tools: ["Python", "Pandas", "SQL", "Power BI"],
    description:
      "Analyze marketing campaign performance using clicks, conversions, customer engagement and marketing KPIs.",
    features: [
      "Campaign Performance",
      "Click Analysis",
      "Conversion Analysis",
      "Customer Engagement",
      "KPI Tracking",
      "Business Insights",
    ],
    formula: "Conversion Rate = (Conversions / Clicks) × 100",
    links: {
      view: "#",
      github: "https://github.com/your-username/marketing-campaign-analytics",
    },
  },
  {
    id: "automobile-data-analysis",
    number: "04",
    title: "Automobile Data Analysis",
    tools: ["Python", "SQL", "Power BI"],
    description:
      "Analyze automobile listings across brand performance, pricing and vehicle condition to surface market insights.",
    features: [
      "Brand Performance",
      "Selling Price",
      "Fuel Type",
      "Transmission",
      "Mileage",
      "Horsepower",
      "Accident History",
      "Location",
      "Vehicle Age",
    ],
    links: {
      view: "#",
      github: "https://github.com/your-username/automobile-data-analysis",
    },
  },
];

// Expose to the rest of the app (main.js reads window.PROJECTS)
window.PROJECTS = PROJECTS;
