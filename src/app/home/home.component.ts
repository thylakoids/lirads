import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	modalityCurrentStudy: string;
	patientID: string;
  thresholdGrowth: string;
  isFinalCategory: boolean;
  finalCategory: string;

	priorStudyRadios = [
	{ value: 'yes', description: 'YES'},
	{ value: 'no',	description: 'NO'}];
	modalityPriorStudyRadios = [
	{	value: 'mr',	description: 'MR'	},
	{	value: 'ct',	description: 'CT'	}];
	segmentsCheckboxs = [
	{	description: '1', selected: false	},
	{	description: '2', selected: false	},
	{	description: '3', selected: false	},
	{	description: '4a', selected: false},
	{	description: '4b', selected: false},
	{	description: '5', selected: false	},
	{	description: '6', selected: false	},
	{	description: '7', selected: false	},
	{	description: '8', selected: false	}];
  observationTypeRadios = [
  {  value: 'mass',  description: 'MASS'  },
  {  value: 'nonmass',  description: 'NON_MASS'  }];
  whichMassRadios = [
  {  value: 'NonHCCMalignancy',  description: 'NON_HCC_MALIGNANCY'  },
  {  value: 'TumorInVein',  description: 'DEFINITE_TUMOR_IN_VEIN'  },
  {  value: 'Treated',  description: 'TREATED'  },
  {  value: 'NoneAbove',  description: 'NONE_ABOVE'  }];
  arterialPhaseEnhancementRadios = [
  {  value: 'Hypo',  description: 'HYPO'  },
  {  value: 'ISO',  description: 'ISO'  },
  {  value: 'Hyper',  description: 'HYPER'  }];
  ancillaryFeaturesCheckboxs = [
  {  description: 'UNDISTORTED_VESSELS', selected: false,  isgreen: true, modality: 'ct' },
  {  description: 'PARALLELS_BLOOD_POOL_ENHANCEMENT', selected: false, isgreen: true, modality: 'ct' },
  {  description: 'MOSAIC_ARCHITECTURE', selected: false, isgreen: false, modality: 'ct' },
  {  description: 'BLODD_PRODUCTS', selected: false, isgreen: false, modality: 'ct' },
  {  description: 'RESTRICTED_DIFFUSION', selected: false, isgreen: false, modality: 'mr' },
  {  description: 'INTRALESIONAL_FAT', selected: false, isgreen: false, modality: 'mr' },
  {  description: 'LESIONAL_IRON_SPARING', selected: false, isgreen: false, modality: 'mr' },
  {  description: 'LESIONAL_FAT_SPARING', selected: false, isgreen: false, modality: 'mr' }];
  t2SignalRadios = [
  {  value: 'MildToModerateHyperintensity',  description: 'MILD_TO_MODERATE_HYPERINTENSITY'  },
  {  value: 'HomogeneousMarkedHyperintensity',  description: 'HOMOGENEOUS_MARKED_HYPERINTENSITY'  },
  {  value: 'HomogeneousMarkedHypointensity',  description: 'HOMOGENEOUS_MARKED_HYPOINTENSITY'  },
  {  value: 'NoneOfTheAbove',  description: 'NONE_OF_THE_ABOVE'  }];
  // isSeenPriorStudyRadios = this.priorStudyRadios.map(item => Object.assign({}, item));

  ancillaryFeaturesStyle(ancillaryFeaturesCheckbox): boolean {
    return ancillaryFeaturesCheckbox.isgreen;
  }


  liradsForm: FormGroup;

  constructor(private fb: FormBuilder, private translate: TranslateService) { 
  	console.clear();
  	
  	this.liradsForm = fb.group({
      'date': ["", Validators.required],
      'priorStudy': ["", Validators.required],
      'modalityPriorStudy': ["", Validators.required],
      'datePriorStudy': ["", Validators.required],
      'observationNumber': ['', Validators.required],
      'diameter': ['', Validators.required],
      'segments': this.buildSegments(),
      'isSeenPriorStudy': ["", Validators.required],
      'diameterPriorStudy': ["", Validators.required],
      'observationType':  ["", Validators.required],
      'whichMass': ["", Validators.required],
      'arterialPhaseEnhancement': ["", Validators.required],
      'washout': ["", Validators.required],
      'capsule': ["", Validators.required],
      'ancillaryFeatures': this.buildAncillaryFeatures(),
      't2Signal': ["", Validators.required],
      'sureOfCategory': ["", Validators.required],
      'adjustCategory': ["", Validators.required],
      'sureOfCategorySecond': ["", Validators.required],
      'adjustCategorySecond': ["", Validators.required],
    });

  	this.modalityCurrentStudy = 'MR';
  	this.patientID = 'XXXXXX';
  }

  get date(): AbstractControl {
    return this.liradsForm.controls['date'];
  }

  get priorStudy(): AbstractControl {
    return this.liradsForm.controls['priorStudy'];
  }

  get modalityPriorStudy(): AbstractControl {
    return this.liradsForm.controls['modalityPriorStudy'];
  }

  get datePriorStudy(): AbstractControl {
    return this.liradsForm.controls['datePriorStudy'];
  }

  get observationNumber(): AbstractControl {
    return this.liradsForm.controls['observationNumber'];
  }

  get diameter(): AbstractControl {
    return this.liradsForm.controls['diameter'];
  }

  buildSegments(): FormArray {
    const arr = this.segmentsCheckboxs.map(s => {
      return this.fb.control(s.selected);
    });
    return this.fb.array(arr);
  }
  get segments(): FormArray {
  	return this.liradsForm.get('segments') as FormArray;
  }

  get isSeenPriorStudy(): AbstractControl {
    return this.liradsForm.get('isSeenPriorStudy') as AbstractControl;
  }

  get diameterPriorStudy(): AbstractControl {
    return this.liradsForm.get('diameterPriorStudy') as AbstractControl;
  }

  get  observationType(): AbstractControl {
    return this.liradsForm.get('observationType') as AbstractControl;
  }

  get whichMass(): AbstractControl {
    return this.liradsForm.get('whichMass') as AbstractControl;
  }

  get arterialPhaseEnhancement(): AbstractControl {
    return this.liradsForm.get('arterialPhaseEnhancement') as AbstractControl;
  }

  get washout(): AbstractControl {
    return this.liradsForm.get('washout') as AbstractControl;
  }

  get capsule(): AbstractControl {
    return this.liradsForm.get('capsule') as AbstractControl;
  }

  buildAncillaryFeatures(): FormArray {
    const arr = this.ancillaryFeaturesCheckboxs.map(s => {
      return this.fb.control(s.selected);
    });
    return this.fb.array(arr);
  }
  get ancillaryFeatures(): FormArray {
    return this.liradsForm.get('ancillaryFeatures') as FormArray;
  }

  get t2Signal(): AbstractControl {
    return this.liradsForm.get('t2Signal') as AbstractControl;
  }

  get sureOfCategory(): AbstractControl {
    return this.liradsForm.get('sureOfCategory') as AbstractControl;
  }

  get adjustCategory(): AbstractControl {
    return this.liradsForm.get('adjustCategory') as AbstractControl;
  }

  onSelectAdjustCategory(p): void {
    console.log('selected adjusted category: ', p);
    if (p.value == 'yes') {
      this.liradsForm.addControl('selectAdjustedCategory', new FormControl("", Validators.required));
    } else {
      this.liradsForm.removeControl('selectAdjustedCategory');
    }
  }

  get selectAdjustedCategory(): AbstractControl {
    return this.liradsForm.get('selectAdjustedCategory') as AbstractControl;
  }

  get sureOfCategorySecond(): AbstractControl {
    return this.liradsForm.get('sureOfCategorySecond') as AbstractControl;
  }

  get adjustCategorySecond(): AbstractControl {
    return this.liradsForm.get('adjustCategorySecond') as AbstractControl;
  }

  // onSelectAdjustCategorySecond(p): void {
  //   console.log('selected adjusted category second: ', p);
  // }

  // isNotValid(control: AbstractControl): boolean {
  //   return !control.valid && control.touched;
  // }

  // onChangeAncillaryFeatures(p): void {
  //   console.log('Ancillary features is changed: ', p);
  // }

  setValue(): void {
    const now = new Date();
    this.date.setValue({year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()});

    // let result = 
    // { "date": { "year": 2017, "month": 6, "day": 15 }, 
    // "priorStudy": "yes", 
    // "modalityPriorStudy": "mr", 
    // "datePriorStudy": { "year": 2017, "month": 6, "day": 1 }, 
    // "observationNumber": 1, 
    // "diameter": 15, 
    // "segments": [ false, true, true, false, false, false, false, false, false ], 
    // "isSeenPriorStudy": "yes", 
    // "diameterPriorStudy": 10, 
    // "observationType": "mass", 
    // "whichMass": "NoneAbove", 
    // "arterialPhaseEnhancement": "Hypo", 
    // "washout": "yes", 
    // "capsule": "yes", 
    // "ancillaryFeatures": [ true, true, false, false, false, false, false, false ], 
    // "t2Signal": "MildToModerateHyperintensity", 
    // "sureOfCategory": "yes", 
    // "adjustCategory": "", 
    // "sureOfCategorySecond": "", 
    // "adjustCategorySecond": "" };
    // this.liradsForm.setValue(result);
  }




  ngOnInit() {
    this.setValue();

    this.priorStudy.valueChanges.subscribe(x => {
      if (x == 'no') {
        this.modalityPriorStudy.setValue('');
        this.datePriorStudy.setValue('');
      }
    });

    this.liradsForm.valueChanges.subscribe(x => {
      this.isFinalCategory = this.calcIsFinalCategory();
      this.finalCategory = this.calcFinalCategory();
    });
    
  }

  isPriorStudy(): boolean {
    return this.priorStudy.value == 'yes';
  }

  isSeenPriorStudyEqualToYes(): boolean {
    return this.isSeenPriorStudy.value=='yes';
  }

  isVisibleThresholdGrowth(): boolean {
    return this.isPriorStudy() && this.datePriorStudy.value!='' && this.isSeenPriorStudy.value!='';
  }

  isObservationTypeEqualToMass(): boolean {
    return this.observationType.value == 'mass';
  }

  isMassEqualToNonAbove(): boolean {
    this.calcThresholdGrowth();
    return this.observationType.value=='mass' && this.whichMass.value == 'NoneAbove';
  }

  isNoSureOfCategory(): boolean {
    return this.sureOfCategory.value == 'no';
  }

  isAdjustedCategory(): boolean {
    return this.adjustCategory.value == 'yes';
  }

  isNoSureOfCategorySecond(): boolean {
     return this.sureOfCategorySecond.value == 'no';
  }

  calcIsFinalCategory(): boolean {
    let result = false;
    if (this.observationType.value=='nonmass' ||
      this.whichMass.value == 'NonHCCMalignancy' ||
      this.whichMass.value == 'TumorInVein' ||
      this.whichMass.value == 'Treated' ||
      this.sureOfCategory.value == 'yes' ||
      this.adjustCategory.value == 'no' ||
      this.sureOfCategorySecond.value == 'yes' ||
      this.adjustCategorySecond.value) {
      result = true;
    } else {
      result = false;
    }
    // console.log('is final category: ', result);
    return result;
  }

  // @todo
  calcFinalCategory(): string {
    let result = '';
    if (this.observationType.value == 'nonmass' ) {
      result = 'LR3 - Intermediate Probability for HCC';
    } 
    else if (this.whichMass.value != 'NoneAbove') {
      switch (this.whichMass.value) {
        case 'NonHCCMalignancy':
        result = 'OM - Other Malignancy';
        break;
        case 'TumorInVein':
        result = 'LR5V - Definitely HCC with Tumor in vein';
        break;
        case 'Treated':
        result = 'LR5 - Treated';
        break;
      }
    } 
    else if (this.sureOfCategory.value == 'yes' || this.adjustCategory.value == 'no') {
      result = this.initialCategory;
    } 
    else if (this.sureOfCategorySecond.value == 'yes') {
      result = this.selectAdjustedCategory.value;
    } else if (this.adjustCategorySecond.value != '') {
      switch (this.adjustCategorySecond.value) {
        case 'yes':
        result = this.potentialAdjustedCategorySecond;
        break;
        case 'no':
        result = this.selectAdjustedCategory.value;
        break;
      }
      
    }
    // console.log('final category is: ', result);
    return result;
  }

  // @todo: 
  calcThresholdGrowth(): void {
    this.translate.get('YES').subscribe((res: string) => {
      this.thresholdGrowth = res;
    });
  }

  // @todo: lirads Clinical Guide
  get initialCategory(): string {
    let result = '';
    if (this.arterialPhaseEnhancement.value != '' &&
      this.washout.value != '' &&
      this.capsule.value != '') {
      result = 'LR3 - Intermediate Probability for HCC';
    }
    return result ; 
  }

  // @todo: Based on the above ancillary features,the category can be adjusted to one of the following options
  get potentialAdjustedCategories(): string[] {
    return ['LR1', 'LR2', 'LR4A'];
  }

  // @todo: Based on tie-breaking rules,the category can be adjusted to the following
  get potentialAdjustedCategorySecond(): string {
    return 'LR3';
  }

  onSubmit(value: object) {
    console.log('form value: ', value);
  }
}
