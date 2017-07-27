import { Injectable } from '@angular/core';

import { YesNo, Modality, ObservationType, WhichMass, ArterialPhaseEnhancement, T2Signal, AncillaryFeaturesColor } from './lirads-level.enum';

@Injectable()
export class ConstantService {

  constructor() { }

  static getDescription(radios, value): string {
  	let description: string = ''
  	for (let entry of radios) {
  		if (entry.value == value) {
  			description = entry.description;
  			break;
  		}
  	}
  	return description;
  }

	static readonly priorStudyRadios = [
		{ value: YesNo[YesNo.yes], description: 'YES'},
		{ value: YesNo[YesNo.no],	description: 'NO'}
	];

	static readonly modalityPriorStudyRadios = [
		{	value: Modality[Modality.mr],	description: 'MR'	},
		{	value: Modality[Modality.ct],	description: 'CT'	}
	];

	static readonly segmentsCheckboxs = [
		{	description: '1', selected: false	},
		{	description: '2', selected: false	},
		{	description: '3', selected: false	},
		{	description: '4a', selected: false},
		{	description: '4b', selected: false},
		{	description: '5', selected: false	},
		{	description: '6', selected: false	},
		{	description: '7', selected: false	},
		{	description: '8', selected: false	}
	];

  static readonly observationTypeRadios = [
	  {  value: ObservationType[ObservationType.mass],  description: 'MASS'  },
	  {  value: ObservationType[ObservationType.nonmass],  description: 'NON_MASS'  }
  ];

  static readonly whichMassRadios = [
	  {  value: WhichMass[WhichMass.NonHCCMalignancy],  description: 'NON_HCC_MALIGNANCY'  },
	  {  value: WhichMass[WhichMass.TumorInVein],  description: 'DEFINITE_TUMOR_IN_VEIN'  },
	  {  value: WhichMass[WhichMass.Treated],  description: 'TREATED'  },
	  {  value: WhichMass[WhichMass.NoneAbove],  description: 'NONE_ABOVE'  }
  ];

  static readonly arterialPhaseEnhancementRadios = [
	  {  value: ArterialPhaseEnhancement[ArterialPhaseEnhancement.Hypo],  description: 'HYPO'  },
	  {  value: ArterialPhaseEnhancement[ArterialPhaseEnhancement.ISO],  description: 'ISO'  },
	  {  value: ArterialPhaseEnhancement[ArterialPhaseEnhancement.Hyper],  description: 'HYPER'  }
  ];

  static readonly ancillaryFeaturesCheckboxs = [
	  {  description: 'UNDISTORTED_VESSELS', selected: false,  color: AncillaryFeaturesColor[AncillaryFeaturesColor.green], modality: Modality[Modality.ct] },
	  {  description: 'PARALLELS_BLOOD_POOL_ENHANCEMENT', selected: false, color: AncillaryFeaturesColor[AncillaryFeaturesColor.green], modality: Modality[Modality.ct] },
	  {  description: 'MOSAIC_ARCHITECTURE', selected: false, color: AncillaryFeaturesColor[AncillaryFeaturesColor.red], modality: Modality[Modality.ct] },
	  {  description: 'BLODD_PRODUCTS', selected: false, color: AncillaryFeaturesColor[AncillaryFeaturesColor.red], modality: Modality[Modality.ct] },
	  {  description: 'RESTRICTED_DIFFUSION', selected: false, color: AncillaryFeaturesColor[AncillaryFeaturesColor.red], modality: Modality[Modality.mr] },
	  {  description: 'INTRALESIONAL_FAT', selected: false, color: AncillaryFeaturesColor[AncillaryFeaturesColor.red], modality: Modality[Modality.mr] },
	  {  description: 'LESIONAL_IRON_SPARING', selected: false, color: AncillaryFeaturesColor[AncillaryFeaturesColor.red], modality: Modality[Modality.mr] },
	  {  description: 'LESIONAL_FAT_SPARING', selected: false, color: AncillaryFeaturesColor[AncillaryFeaturesColor.red], modality: Modality[Modality.mr] }
  ];

  static readonly t2SignalRadios = [
	  {  value: T2Signal[T2Signal.MildToModerateHyperintensity],  description: 'MILD_TO_MODERATE_HYPERINTENSITY', color: AncillaryFeaturesColor[AncillaryFeaturesColor.red]  },
	  {  value: T2Signal[T2Signal.HomogeneousMarkedHyperintensity],  description: 'HOMOGENEOUS_MARKED_HYPERINTENSITY', color: AncillaryFeaturesColor[AncillaryFeaturesColor.green]  },
	  {  value: T2Signal[T2Signal.HomogeneousMarkedHypointensity],  description: 'HOMOGENEOUS_MARKED_HYPOINTENSITY', color: AncillaryFeaturesColor[AncillaryFeaturesColor.green]  },
	  {  value: T2Signal[T2Signal.NoneOfTheAbove],  description: 'NONE_OF_THE_ABOVE', color: AncillaryFeaturesColor[AncillaryFeaturesColor.unknown]  }
  ];
}


