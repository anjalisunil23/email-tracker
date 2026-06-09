import { Request, Response } from 'express';
import Email from '../models/Email';
import OpenEvent from '../models/OpenEvent';
import ClickEvent from '../models/ClickEvent';
import path from 'path';
import { notifyUser } from '../services/socket';
import geoip from 'geoip-lite';

const getDeviceInfo = (userAgent: string) => {
    // Basic device info parsing
    const deviceType = /Mobi|Android/i.test(userAgent) ? 'Mobile' : 'Desktop';
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    
    let operatingSystem = 'Unknown';
    if (userAgent.includes('Win')) operatingSystem = 'Windows';
    else if (userAgent.includes('Mac')) operatingSystem = 'MacOS';
    else if (userAgent.includes('Linux')) operatingSystem = 'Linux';
    else if (userAgent.includes('Android')) operatingSystem = 'Android';
    else if (userAgent.includes('like Mac')) operatingSystem = 'iOS';

    return { deviceType, browser, operatingSystem };
}

export const trackOpen = async (req: Request, res: Response) => {
  try {
    const { trackingId } = req.params;
    const email = await Email.findOne({ trackingId });

    if (email) {
      const userAgent = req.headers['user-agent'] || '';
      const { deviceType, browser, operatingSystem } = getDeviceInfo(userAgent);
      
      let location = 'Unknown';
      const ip = req.ip || '';
      const geo = geoip.lookup(ip);
      if (geo) {
        location = `${geo.city || 'Unknown City'}, ${geo.country || 'Unknown Country'}`;
      }

      const openEvent = new OpenEvent({
        emailId: email._id,
        ipAddress: ip,
        userAgent,
        deviceType,
        browser,
        operatingSystem,
        location,
      });
      await openEvent.save();

      notifyUser(email.userId.toString(), 'email_opened', {
        emailId: email._id,
        subject: email.subject,
        recipient: email.recipient,
      });
    }
  } catch (err: any) {
    console.error(err.message);
  }
  
  const pixel = path.join(__dirname, '..', 'assets', 'pixel.png');
  res.sendFile(pixel);
};

export const trackClick = async (req: Request, res: Response) => {
  try {
    const { trackingId } = req.params;
    const { url } = req.query;
    const email = await Email.findOne({ trackingId });

    if (email && url) {
      const userAgent = req.headers['user-agent'] || '';
      const { deviceType, browser, operatingSystem } = getDeviceInfo(userAgent);

      let location = 'Unknown';
      const ip = req.ip || '';
      const geo = geoip.lookup(ip);
      if (geo) {
        location = `${geo.city || 'Unknown City'}, ${geo.country || 'Unknown Country'}`;
      }

      const clickEvent = new ClickEvent({
        emailId: email._id,
        originalUrl: url as string,
        ipAddress: ip,
        userAgent,
        deviceType,
        browser,
        operatingSystem,
        location,
      });
      await clickEvent.save();
      
      notifyUser(email.userId.toString(), 'link_clicked', {
        emailId: email._id,
        subject: email.subject,
        recipient: email.recipient,
        url: url as string,
      });

      return res.redirect(url as string);
    }
  } catch (err: any) {
    console.error(err.message);
  }
  // Fallback redirect
  res.redirect('/');
};
