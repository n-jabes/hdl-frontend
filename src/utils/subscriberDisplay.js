export const formatDemoMSISDN = (msisdn) =>
  msisdn ? msisdn.replace(/^250/, "255") : msisdn;

export const formatDemoIMSI = (imsi) =>
  imsi ? imsi.replace(/^63510/, "64002") : imsi;

export const formatDemoLocation = (location) =>
  location && location !== "?"
    ? location.replace(/^635-10/, "640-02")
    : location;

export const toBackendFilterValue = (filterType, filterValue) => {
  if (!filterValue) return filterValue;
  if (filterType === "MSISDN") return filterValue.replace(/^255/, "250");
  if (filterType === "IMSI") return filterValue.replace(/^64002/, "63510");
  return filterValue;
};

export const mapSubscriberForDisplay = (subscriber, index, formatDateToYMDHM) => ({
  id: index + 1,
  count: index + 1,
  startTime: formatDateToYMDHM(subscriber.startTime),
  IMSI: formatDemoIMSI(subscriber.IMSI),
  MSISDN: formatDemoMSISDN(subscriber.MSISDN),
  maskedMSISDN: "*******",
  IMEI: subscriber.IMEI,
  MM: subscriber.MM,
  R: subscriber.R,
  Location: formatDemoLocation(subscriber.Location),
  SiteName: subscriber?.matchingCoreArea?.SiteName,
  SectorLocation: subscriber?.matchingCoreArea?.SectorLocation,
});

export const mapSubscribersForDisplay = (subscribers, formatDateToYMDHM) =>
  subscribers.map((subscriber, index) =>
    mapSubscriberForDisplay(subscriber, index, formatDateToYMDHM),
  );
