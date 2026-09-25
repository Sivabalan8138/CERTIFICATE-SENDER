import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalEvents = await prisma.event.count();
    const totalParticipants = await prisma.participant.count({
      where: { status: 'Valid' }
    });
    const certificatesGenerated = await prisma.participant.count({
      where: { isGenerated: true }
    });
    const emailsSent = await prisma.emailLog.count({
      where: { status: 'Sent' }
    });
    const emailsFailed = await prisma.emailLog.count({
      where: { status: 'Failed' }
    });

    const recentActivity = [
      { text: `${certificatesGenerated} certificates generated`, type: 'success', time: 'Recently' },
      { text: `${emailsSent} emails sent`, type: 'success', time: 'Recently' },
      { text: `${emailsFailed} emails failed`, type: 'error', time: 'Recently' }
    ];

    res.json({
      totalEvents,
      totalParticipants,
      certificatesGenerated,
      emailsSent,
      emailsFailed,
      recentActivity
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
