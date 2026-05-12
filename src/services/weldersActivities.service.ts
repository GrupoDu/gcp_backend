import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  ICreateWeldersActivities,
  IWeldersActivities,
} from "../types/weldersActivities.interface.js";

class WeldersActivitiesService {
  private _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async getWeldersActivities(): Promise<IWeldersActivities[]> {
    return this._prisma.welders_activities.findMany();
  }

  async getWelderActivitiesByWelderId(
    welder_uuid: string,
  ): Promise<IWeldersActivities[]> {
    return this._prisma.welders_activities.findMany({
      where: {
        welder_uuid,
      },
    });
  }

  async registerWelderActivity(
    newWelderActivity: ICreateWeldersActivities,
  ): Promise<IWeldersActivities> {
    return this._prisma.welders_activities.create({
      data: newWelderActivity,
    });
  }
}

export default WeldersActivitiesService;
