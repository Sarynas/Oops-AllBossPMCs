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
        
        // Use boss brains for PMCs with equal probability
        const bossBrains = {
            "bossKilla": 1,
            "bossKnight": 1,
            "bossSanitar": 1,
            "bossTagilla": 1,
            "followerBully": 1,
            "followerBigPipe": 1
        };
        
        // Apply the boss brains to both PMC types (BEAR and USEC)
        for (const pmcType in pmcConfig.pmcType)
        {
            for (const mapKey in pmcConfig.pmcType[pmcType])
            {
                pmcConfig.pmcType[pmcType][mapKey] = {};
                // Copy all the boss brains to the configuration
                for (const brainType in bossBrains) {
                    pmcConfig.pmcType[pmcType][mapKey][brainType] = bossBrains[brainType];
                }
            }
        }
        
        // Keep the original player scav brain configuration from Drakia's mod
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