export enum LiradsLevel {
	  LR1,
  	LR2,
  	LR3,
  	LR4A,
  	LR4B,
  	LR5A,
  	LR5B,
  	LR5V,
  	LR5,
  	OM
}

export enum YesNo {
	yes, no
}

export enum Modality {
	mr, ct
}

export enum ObservationType {
	mass, nonmass
}

export enum WhichMass {
	NonHCCMalignancy, TumorInVein, Treated, NoneAbove
}

export enum ArterialPhaseEnhancement {
	Hypo, ISO, Hyper
}

export enum T2Signal {
	MildToModerateHyperintensity, 
	HomogeneousMarkedHyperintensity, 
	HomogeneousMarkedHypointensity,
	NoneOfTheAbove
}

export enum AncillaryFeaturesColor {
	green,
	red,
	unknown
}
