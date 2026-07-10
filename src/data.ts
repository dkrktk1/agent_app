export const INITIAL_PLAYERS: any = {};

export const BASE_PLAYER_TEMPLATE: any = {
  status: "success",
  profileImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  metrics: {
    acwr: 0,
    grip: 0,
    hrv: 0,
    rpe: 0,
    weight: 0,
    weightTarget: 0,
    gripRaw: 0,
    gripBaseline: 0,
    sleep: 0
  },
  acwrChartData: {
    labels: [],
    acute: [],
    chronic: [],
    acwr: []
  },
  gripChartData: {
    labels: [],
    values: [],
    leftValues: [],
    rightValues: []
  },
  acwrGraphData: [],
  sleepChartData: [],
  statcast: {
    title: "데이터 수집 중",
    recent: "-",
    season: "-",
    status: "-",
    desc: "충분한 데이터가 누적되면 지표가 활성화됩니다."
  },
  diets: [],
  schedules: [],
  inventory: [],
  sponsorshipItems: [],
  budget: 0,
  contracts: {
    war: 0.0,
    marketVal: 0,
    proposalVal: 0,
    comps: [],
    pdfData: [],
    sponsorships: []
  }
};
