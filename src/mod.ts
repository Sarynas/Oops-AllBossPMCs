import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IPmcConfig } from "@spt/models/spt/config/IPmcConfig";
import { IBotConfig } from "@spt/models/spt/config/IBotConfig";

class Mod implements IPostDBLoadMod
{
    public postDBLoad(container: DependencyContainer): void
    {
        const configServer = container.resolve<ConfigServer>("ConfigServer");

        const pmcConfig: IPmcConfig = configServer.getConfig(ConfigTypes.PMC);
        const botConfig: IBotConfig = configServer.getConfig(ConfigTypes.BOT);
        

        // Reduce PMCs to a single choice, their base brain type
        const defaultBrains = {
            "pmcbear": {
                "bossKilla": 1,
                "bossKnight": 1,
                "bossSanitar": 1,
                "bossTagilla": 1,
                "followerBully": 1,
                "followerBigPipe": 1
            },
            "pmcusec": {
                "bossKilla": 1,
                "bossKnight": 1,
                "bossSanitar": 1,
                "bossTagilla": 1,
                "followerBully": 1,
                "followerBigPipe": 1
            }
        }
        for (const pmcType in pmcConfig.pmcType)
        {
            for (const mapKey in pmcConfig.pmcType[pmcType])
            {
                pmcConfig.pmcType[pmcType][mapKey] = {};
                pmcConfig.pmcType[pmcType][mapKey] = defaultBrains[pmcType];
            }
        }

        // Player scavs get to randomly choose between a BEAR, a USEC, or a scav
        const playerScavBrains = {
            "assault": 1,
            "pmcBEAR": 1,
            "pmcUSEC": 1
        };
        for (const mapKey in botConfig.playerScavBrainType)
        {
            botConfig.playerScavBrainType[mapKey] = playerScavBrains;
        }
    }
}

export const mod = new Mod();
