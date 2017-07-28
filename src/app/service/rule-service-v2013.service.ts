import { Injectable } from '@angular/core';
import { ConstantService } from '../service/constant.service';
import { LiradsLevel, YesNo, ArterialPhaseEnhancement, AncillaryFeaturesColor, ObservationType, WhichMass } from './lirads-level.enum';
import { DateInterface } from './date-interface';

import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ThresholdGrowthV2013Service {
  private priorStudy: string;
  private date: DateInterface;
  private datePriorStudy: DateInterface;
  private monthEarlier: number;
  private diameter: number;
  private diameterPriorStudy: number;

  constructor(priorStudy: string, date: DateInterface, datePriorStudy: DateInterface, diameter: number, diameterPriorStudy: number) {
    this.priorStudy = priorStudy;
    this.date = date;
    this.datePriorStudy = datePriorStudy;
    this.diameter = diameter;
    this.diameterPriorStudy = diameterPriorStudy;
  }

  apply(): string {
    let thresholdGrowth = YesNo[YesNo.no];

    if (this.priorStudy == YesNo[YesNo.no]) {
      if (this.diameter >= 10) {
        thresholdGrowth = YesNo[YesNo.yes];
      }
    }

    if (this.priorStudy == YesNo[YesNo.yes]) {
      let year_interval = this.date.year - this.datePriorStudy.year;
      let month_interval = this.date.month - this.datePriorStudy.month;
      let day_interval = this.date.day - this.datePriorStudy.day; 
      let month_earlier = year_interval*12 + month_interval ;
      if ( month_earlier > 6) {
        if (this.diameter >= 2.0 * this.diameterPriorStudy) {
          thresholdGrowth = YesNo[YesNo.yes]
        }
      } else {
        if (this.diameter >= 1.5 * this.diameterPriorStudy) {
          thresholdGrowth = YesNo[YesNo.yes]
        }
      }
    }

    return thresholdGrowth;
  }
}

@Injectable()
export class RuleServiceV2013Service {
	private cwt: number;
	private atl: string;
	private diameter: number;


  constructor(cwt: number, atl: string, diameter: number) {
  	this.cwt = cwt;
  	this.atl = atl;
  	this.diameter = diameter;
  }

  apply(): string {
  	let level: LiradsLevel = LiradsLevel.LR3;

  	if (this.cwt == 0 && this.atl != ArterialPhaseEnhancement[ArterialPhaseEnhancement.Hyper] ||
  		this.cwt == 0 && this.atl == ArterialPhaseEnhancement[ArterialPhaseEnhancement.Hyper] && this.diameter < 20 ||
  		this.cwt == 1 && this.atl != ArterialPhaseEnhancement[ArterialPhaseEnhancement.Hyper] && this.diameter < 20) {
  		level = LiradsLevel.LR3;
  	}

  	if (this.cwt == 1 && this.atl == ArterialPhaseEnhancement[ArterialPhaseEnhancement.Hyper] && this.diameter < 20 ||
  		this.cwt >= 2 && this.atl != ArterialPhaseEnhancement[ArterialPhaseEnhancement.Hyper] && this.diameter < 20 ||
  		this.cwt >= 2 && this.atl == ArterialPhaseEnhancement[ArterialPhaseEnhancement.Hyper] && this.diameter < 10) {
  		level = LiradsLevel.LR4A;
  	}

  	if (this.cwt == 0 && this.atl == ArterialPhaseEnhancement[ArterialPhaseEnhancement.Hyper] && this.diameter >= 20 ||
  		this.cwt >= 1 && this.atl != ArterialPhaseEnhancement[ArterialPhaseEnhancement.Hyper] && this.diameter >= 20 ) {
  		level = LiradsLevel.LR4B;
  	}

  	if (this.cwt >= 2 && this.atl == ArterialPhaseEnhancement[ArterialPhaseEnhancement.Hyper] && 10<=this.diameter&&this.diameter<20) {
  		level = LiradsLevel.LR5A;
  	}

  	if (this.cwt >= 1 && this.atl == ArterialPhaseEnhancement[ArterialPhaseEnhancement.Hyper] && this.diameter >= 20) {
  		level = LiradsLevel.LR5B;
  	}

  	return LiradsLevel[level];
  } 

  static calcCWT(washout: string, capsule: string, thresholdGrowth: string): number {
    let cwt = 0;
    if (washout == YesNo[YesNo.yes]) cwt += 1;
    if (capsule == YesNo[YesNo.yes]) cwt += 1;
    if (thresholdGrowth == YesNo[YesNo.yes]) cwt += 1;
    return cwt;
  }

  static ruleByObservationTypeAndWhichMass(observationType: string, whichMass: string): string {
    let result = '';
    if (observationType == ObservationType[ObservationType.nonmass] ) {
      result = LiradsLevel[LiradsLevel.LR3]; 
    } 
    else if (whichMass != WhichMass[WhichMass.NoneAbove]) {
      switch (whichMass) {
        case WhichMass[WhichMass.NonHCCMalignancy]:
        result = LiradsLevel[LiradsLevel.OM]; 
        break;
        case WhichMass[WhichMass.TumorInVein]:
        result = LiradsLevel[LiradsLevel.LR5V]; 
        break;
        case WhichMass[WhichMass.Treated]:
        result = LiradsLevel[LiradsLevel.LR5]; 
        break;
      }
    } 

    return result;
  }
}

@Injectable()
export class AncillaryFeaturesV2013Service {
  private ancillaryFeatures: boolean[];
  private t2Signal: string;
  private initialCategory: string;


  constructor(private translate: TranslateService, ancillaryFeatures: boolean[], t2Signal: string, initialCategory: string) {
    this.ancillaryFeatures = ancillaryFeatures;
    this.t2Signal = t2Signal;
    this.initialCategory = initialCategory;
  }

  apply(): string[] {
    let ancillaryFeatureSelected = [];
    for (let i = 0 ; i < this.ancillaryFeatures.length ; ++ i ) {
      if (this.ancillaryFeatures[i]) {
        ancillaryFeatureSelected.push(ConstantService.ancillaryFeaturesCheckboxs[i]);
      }
    }
    // ancillaryFeatureSelected.forEach(x => console.log(`ancillaryFeatures = ${x['description']}, color = ${x['color']}`));

    let colors = ancillaryFeatureSelected.map(x => x['color']);

    let t2SignalRadio = ConstantService.t2SignalRadios.filter(x => x.value == this.t2Signal);
    // t2SignalRadio.forEach(x => console.log(`t2Signal = ${x['description']}, color=${x['color']}`));
    t2SignalRadio.forEach(x => colors.push(x['color']));
    
    let colorSet = new Set(colors);

    let potentialCategories = [];
    // console.log(`this.initialCategory = ${this.initialCategory}`);
    if (colorSet.has(AncillaryFeaturesColor[AncillaryFeaturesColor.green])) {
      // console.log(`colors = ${colors}, has green`);
      let pcRed = [];
      switch (this.initialCategory) {
        case LiradsLevel[LiradsLevel.LR3]:
        pcRed = [LiradsLevel[LiradsLevel.LR1], LiradsLevel[LiradsLevel.LR2]];
        break;
        case LiradsLevel[LiradsLevel.LR4A]:
        case LiradsLevel[LiradsLevel.LR4B]:
        pcRed = [LiradsLevel[LiradsLevel.LR1], LiradsLevel[LiradsLevel.LR2], LiradsLevel[LiradsLevel.LR3]];
        break; 
        case LiradsLevel[LiradsLevel.LR5A]:
        case LiradsLevel[LiradsLevel.LR5B]:
        pcRed = [LiradsLevel[LiradsLevel.LR1], LiradsLevel[LiradsLevel.LR2], LiradsLevel[LiradsLevel.LR3], LiradsLevel[LiradsLevel.LR4A], LiradsLevel[LiradsLevel.LR4B]];
        break; 
        default:
        break;
      }
      potentialCategories = potentialCategories.concat(pcRed);
    } 

    if (colorSet.has(AncillaryFeaturesColor[AncillaryFeaturesColor.red])) {
      // console.log(`colors = ${colors}, has red`);
      let pcGreen = [];
      switch (this.initialCategory) {
        case LiradsLevel[LiradsLevel.LR3]:
        pcGreen = [LiradsLevel[LiradsLevel.LR4A], LiradsLevel[LiradsLevel.LR4B]];
        break;
        case LiradsLevel[LiradsLevel.LR4A]:
        break; 
        case LiradsLevel[LiradsLevel.LR5A]:
        break; 
        default:
        break;
      }
      potentialCategories = potentialCategories.concat(pcGreen);
    }
    
    // console.log(`potentialCategories = ${potentialCategories}`);
    return potentialCategories;
  } 

  description(potentialCategories: string[]): string[] {
    let result = [];
    potentialCategories.map(x => this.translate.get(x).subscribe((res: string) => {
      // console.log(`x = ${x}, res = ${res}`);
      result.push(res);
    }));
    return result;
  }
}

@Injectable()
export class TieBreakingV2013Service {
  private initialCategory: string;
  private selectAdjustedCategory: string;


  
  constructor(initialCategory: string, selectAdjustedCategory: string) {
    this.initialCategory = initialCategory;
    this.selectAdjustedCategory = selectAdjustedCategory;
  }

  apply(): string {
    let resultTieBreaking = this.selectAdjustedCategory;
    if (this.initialCategory.includes(LiradsLevel[LiradsLevel.LR5]))  {
      if (this.selectAdjustedCategory == LiradsLevel[LiradsLevel.LR1]) {
        resultTieBreaking = LiradsLevel[LiradsLevel.LR2];
      }
      if (this.selectAdjustedCategory == LiradsLevel[LiradsLevel.LR2]) {
        resultTieBreaking = LiradsLevel[LiradsLevel.LR3];
      }
      if (this.selectAdjustedCategory == LiradsLevel[LiradsLevel.LR3]) {
        resultTieBreaking = LiradsLevel[LiradsLevel.LR3];
      }
      if (this.selectAdjustedCategory == LiradsLevel[LiradsLevel.LR4A] || this.selectAdjustedCategory == LiradsLevel[LiradsLevel.LR4B]) {
        resultTieBreaking = LiradsLevel[LiradsLevel.LR3];
      }
    }

    if (this.initialCategory == LiradsLevel[LiradsLevel.LR4A] || this.initialCategory == LiradsLevel[LiradsLevel.LR4B]) {
      if (this.selectAdjustedCategory == LiradsLevel[LiradsLevel.LR1]) {
        resultTieBreaking = LiradsLevel[LiradsLevel.LR2];
      }
      if (this.selectAdjustedCategory == LiradsLevel[LiradsLevel.LR2]) {
        resultTieBreaking = LiradsLevel[LiradsLevel.LR3];
      }
      if (this.selectAdjustedCategory == LiradsLevel[LiradsLevel.LR3]) {
        resultTieBreaking = LiradsLevel[LiradsLevel.LR3];
      }
      // console.log(`this.initialCategory=${this.initialCategory}, this.selectAdjustedCategory=${this.selectAdjustedCategory}, resultTieBreaking=${resultTieBreaking}`);
    }

    if (this.initialCategory == LiradsLevel[LiradsLevel.LR3] ) {
      if (this.selectAdjustedCategory == LiradsLevel[LiradsLevel.LR1]) {
        resultTieBreaking = LiradsLevel[LiradsLevel.LR2];
      }
      if (this.selectAdjustedCategory == LiradsLevel[LiradsLevel.LR2]) {
        resultTieBreaking = LiradsLevel[LiradsLevel.LR3];
      }
      if (this.selectAdjustedCategory == LiradsLevel[LiradsLevel.LR4A] || this.selectAdjustedCategory == LiradsLevel[LiradsLevel.LR4B]) {
        resultTieBreaking = LiradsLevel[LiradsLevel.LR3];
      }
    }

    return resultTieBreaking;
  }
}