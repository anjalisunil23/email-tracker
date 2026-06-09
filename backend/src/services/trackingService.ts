import OpenEvent from '../models/OpenEvent';
import ClickEvent from '../models/ClickEvent';
import Email from '../models/Email';
// @ts-ignore: geoip-lite does not have type definitions
import geoip from 'geoip-lite';

export async function getEmailDetails(emailId: string) {
  const [opens, clicks] = await Promise.all([
    OpenEvent.find({ emailId }).lean(),
    ClickEvent.find({ emailId }).lean(),
  ]);

  const enrich = (event: any) => {
    const geo = geoip.lookup(event.ipAddress || event.ip);
    return {
      ...event,
      location: geo ? { latitude: geo.ll[0], longitude: geo.ll[1], city: geo.city, country: geo.country } : null,
    };
  };

  return {
    opens: opens.map(enrich),
    clicks: clicks.map(enrich),
  };
}
