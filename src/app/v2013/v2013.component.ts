import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { ConstantService } from '../service/constant.service';
import { 
  RuleServiceV2013Service, 
  ThresholdGrowthV2013Service, 
  AncillaryFeaturesV2013Service,
  TieBreakingV2013Service } from '../service/rule-service-v2013.service';
import { 
  LiradsLevel, 
  YesNo, 
  Modality, 
  ObservationType, 
  WhichMass, 
  ArterialPhaseEnhancement, 
  T2Signal, 
  AncillaryFeaturesColor } from '../service/lirads-level.enum';

@Component({
  selector: 'app-v2013',
  templateUrl: './v2013.component.html',
  styleUrls: ['./v2013.component.css']
})
export class V2013Component implements OnInit {
	modalityCurrentStudy: string;
	patientID: string;
  thresholdGrowth: string;
  isFinalCategory: boolean;
  finalCategory: string;
  potentialAdjustedCategories: string[];
  private maxDatePriorStudy: NgbDateStruct;

  priorStudyRadios = ConstantService.priorStudyRadios;
  modalityPriorStudyRadios = ConstantService.modalityPriorStudyRadios;
  segmentsCheckboxs = ConstantService.segmentsCheckboxs;
  observationTypeRadios = ConstantService.observationTypeRadios;
  whichMassRadios = ConstantService.whichMassRadios;
  arterialPhaseEnhancementRadios = ConstantService.arterialPhaseEnhancementRadios;
  ancillaryFeaturesCheckboxs = ConstantService.ancillaryFeaturesCheckboxs;
  t2SignalRadios = ConstantService.t2SignalRadios;

	
  // isSeenPriorStudyRadios = this.priorStudyRadios.map(item => Object.assign({}, item));

  ancillaryFeaturesStyleGreen(ancillaryFeaturesCheckbox): boolean {
    return ancillaryFeaturesCheckbox['color'] == AncillaryFeaturesColor[AncillaryFeaturesColor.green];
  }
  ancillaryFeaturesStyleRed(ancillaryFeaturesCheckbox): boolean {
    return ancillaryFeaturesCheckbox['color'] == AncillaryFeaturesColor[AncillaryFeaturesColor.red];
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

  	this.modalityCurrentStudy = ConstantService.getDescription(ConstantService.modalityPriorStudyRadios, 'mr');
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
    // console.log('selected adjusted category: ', p);
    if (p.value == YesNo[YesNo.yes]) {
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

  
  setValue(): void {
    const now = new Date();
    this.date.setValue({year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()});

    let result = 
    { "date": { "year": 2017, "month": 6, "day": 15 }, 
    "priorStudy": "yes", 
    "modalityPriorStudy": "mr", 
    "datePriorStudy": { "year": 2017, "month": 6, "day": 1 }, 
    "observationNumber": 1, 
    "diameter": 15, 
    "segments": [ false, true, true, false, false, false, false, false, false ], 
    "isSeenPriorStudy": "yes", 
    "diameterPriorStudy": 10, 
    "observationType": "mass", 
    "whichMass": "NoneAbove", 
    "arterialPhaseEnhancement": "Hypo", 
    "washout": "yes", 
    "capsule": "yes", 
    "ancillaryFeatures": [ true, true, false, false, false, false, false, false ], 
    "t2Signal": "MildToModerateHyperintensity", 
    "sureOfCategory": "yes", 
    "adjustCategory": "", 
    "sureOfCategorySecond": "", 
    "adjustCategorySecond": "" };
    this.liradsForm.setValue(result);
  }

  ngOnInit() {
    this.priorStudy.valueChanges.subscribe(x => {
      if (x == YesNo[YesNo.no]) {
        if (this.modalityPriorStudy) this.modalityPriorStudy.setValue('');
        if (this.datePriorStudy) this.datePriorStudy.setValue('');
      }
    });

    this.sureOfCategorySecond.valueChanges.subscribe(x => {
      if (x) {
        if (this.adjustCategorySecond) this.adjustCategorySecond.setValue('');
      }
    });

    this.adjustCategory.valueChanges.subscribe(x => {
      if (x) {
        if (this.selectAdjustedCategory) this.selectAdjustedCategory.setValue('');
        if (this.sureOfCategorySecond) this.sureOfCategorySecond.setValue('');
        if (this.adjustCategorySecond) this.adjustCategorySecond.setValue('');
      }
    });

    this.sureOfCategory.valueChanges.subscribe(x => {
      if (x) {
        if (this.adjustCategory) this.adjustCategory.setValue('');
        if (this.selectAdjustedCategory) this.selectAdjustedCategory.setValue('');
        if (this.sureOfCategorySecond) this.sureOfCategorySecond.setValue('');
        if (this.adjustCategorySecond) this.adjustCategorySecond.setValue('');
      }
    });

    this.observationType.valueChanges.subscribe(x => {
      if (x) {
        if (this.whichMass) this.whichMass.setValue('');
        if (this.washout) this.washout.setValue('');
        if (this.capsule) this.capsule.setValue('');
        if (this.arterialPhaseEnhancement) this.arterialPhaseEnhancement.setValue('');
        if (this.ancillaryFeatures) this.ancillaryFeatures.setValue([false, false, false, false, false, false, false, false]);
        if (this.t2Signal) this.t2Signal.setValue('');
        if (this.sureOfCategory) this.sureOfCategory.setValue('');

        if (this.adjustCategory) this.adjustCategory.setValue('');
        if (this.selectAdjustedCategory) this.selectAdjustedCategory.setValue('');
        if (this.sureOfCategorySecond) this.sureOfCategorySecond.setValue('');
        if (this.adjustCategorySecond) this.adjustCategorySecond.setValue('');
      }
    });


    this.liradsForm.valueChanges.subscribe(x => {
      this.potentialAdjustedCategories = this.calcPotentialAdjustedCategories();
      this.isFinalCategory = this.calcIsFinalCategory();
      this.finalCategory = this.calcFinalCategory();
      this.maxDatePriorStudy = this.date.value;
    });

    this.setValue();
  }

  isPriorStudy(): boolean {
    return this.priorStudy.value == YesNo[YesNo.yes];
  }

  isSeenPriorStudyEqualToYes(): boolean {
    return this.isSeenPriorStudy.value==YesNo[YesNo.yes];
  }

  isVisibleThresholdGrowth(): boolean {
    return this.isPriorStudy() && this.datePriorStudy.value!='' && this.isSeenPriorStudy.value!='';
  }

  isObservationTypeEqualToMass(): boolean {
    return this.observationType.value == ObservationType[ObservationType.mass];
  }

  isMassEqualToNonAbove(): boolean {
    this.calcThresholdGrowth();
    return this.observationType.value==ObservationType[ObservationType.mass] && this.whichMass.value == WhichMass[WhichMass.NoneAbove];
  }

  isNoSureOfCategory(): boolean {
    return this.sureOfCategory.value == YesNo[YesNo.no] && this.potentialAdjustedCategories.length!=0;
  }

  isAdjustedCategory(): boolean {
    return this.adjustCategory.value == YesNo[YesNo.yes];
  }

  isCheckedSelectAdjustedCategory(p: string): boolean {
    return this.selectAdjustedCategory.value==p;
  }

  isSelectAdjustedCategory(): boolean {
    return this.selectAdjustedCategory.value != '';
  }

  isNoSureOfCategorySecond(): boolean {
     return this.sureOfCategorySecond.value == YesNo[YesNo.no];
  }

  calcIsFinalCategory(): boolean {
    let result = false;
    if (this.observationType.value==ObservationType[ObservationType.nonmass] ||
      this.whichMass.value == WhichMass[WhichMass.NonHCCMalignancy] ||
      this.whichMass.value == WhichMass[WhichMass.TumorInVein] ||
      this.whichMass.value == WhichMass[WhichMass.Treated] ||
      !this.isNoSureOfCategory() || 
      this.adjustCategory.value == YesNo[YesNo.no] ||
      this.sureOfCategorySecond.value == YesNo[YesNo.yes] ||
      this.adjustCategorySecond.value) {
      result = true;
    } else {
      result = false;
    }
    // console.log('is final category: ', result);
    return result;
  }

  // rule: threshold growth
  calcThresholdGrowth(): void {
    this.thresholdGrowth = new ThresholdGrowthV2013Service(this.priorStudy.value, 
      this.date.value, this.datePriorStudy.value, 
      this.diameter.value, this.diameterPriorStudy.value).apply();
    // console.log(`after calc, this.thresholdGrowth = ${this.thresholdGrowth}`);
  }

  // rule: lirads Clinical Guide
  get initialCategory(): string {
    let result = '';
    if (this.arterialPhaseEnhancement.value != '' &&
      this.washout.value != '' &&
      this.capsule.value != '' && 
      this.diameter.value != '') {
      let cwt = RuleServiceV2013Service.calcCWT(this.washout.value, this.capsule.value, this.thresholdGrowth);
      let atl = this.arterialPhaseEnhancement.value ; 
      // console.log(`cwt = ${cwt}, atl = ${atl}, diameter = ${this.diameter.value}`);
      result = new RuleServiceV2013Service(cwt, atl, this.diameter.value).apply();
    }
    return result ; 
  }

  // rule: Based on the above ancillary features,the category can be adjusted to one of the following options
  calcPotentialAdjustedCategories(): string[] {
    let result = new AncillaryFeaturesV2013Service(this.translate, this.ancillaryFeatures.value, this.t2Signal.value, this.initialCategory).apply();
    // console.log(`potentialAdjustedCategories = ${result}`);
    return result;
  }

  get potentialAdjustedCategoriesDescription(): string[] {
    let service = new AncillaryFeaturesV2013Service(this.translate, this.ancillaryFeatures.value, this.t2Signal.value, this.initialCategory);
    return service.description(service.apply());
  }

  // @todo: Based on tie-breaking rules,the category can be adjusted to the following
  get potentialAdjustedCategorySecond(): string {
    return new TieBreakingV2013Service(this.initialCategory, this.selectAdjustedCategory.value).apply();
  }

  // rule:
  calcFinalCategory(): string {
    let result = '';
    if (this.observationType.value == ObservationType[ObservationType.nonmass] ) {
      result = LiradsLevel[LiradsLevel.LR3]; 
    } 
    else if (this.whichMass.value != WhichMass[WhichMass.NoneAbove]) {
      switch (this.whichMass.value) {
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
    else if (!this.isNoSureOfCategory() || this.adjustCategory.value == YesNo[YesNo.no]) {
      result = this.initialCategory;
    } 
    else if (this.sureOfCategorySecond.value == YesNo[YesNo.yes]) {
      result = this.selectAdjustedCategory.value;
    } else if (this.adjustCategorySecond.value != '') {
      switch (this.adjustCategorySecond.value) {
        case YesNo[YesNo.yes]:
        result = this.potentialAdjustedCategorySecond;
        break;
        case YesNo[YesNo.no]:
        result = this.selectAdjustedCategory.value;
        break;
      }
      
    }
    // console.log('final category is: ', result);
    return result;
  }

  onSubmit(value: object) {
    console.log('form value: ', value);
  }
}
