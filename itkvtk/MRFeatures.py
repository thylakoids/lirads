#!/usr/bin/env python

import numpy as np
import cv2

'''
@author: qizhong.lin@philips.com

the class SingleSequenceFeatureExtractor
    classifyEhancement()   test the sequence has hyper enhancement or hypo
    isCapsule()   test the sequence has capusle or not
the class WashoutExtractor
    isWashout() test the sequence has washout or not

please select CalcModeEnum for values calculation like mean on single slide, multi-slides or volumn
'''
from enum import Enum
class EnhancementEnum(Enum):
    Hyper = 1
    HypoOrIso = 2

class CalcModeEnum(Enum):
    SingleSlide = 1          # the largest tumor
    MultiSlides = 2     # slides range (mean-std, mean+std)
    Volumn = 3

class SingleSequenceFeatureExtractor(object):
    def __init__(self, sequence, tumor_mask, liver_mask, calc_mode=CalcModeEnum.Volumn):
        self.sequence = sequence
        self.tumor_mask = tumor_mask
        self.liver_mask = liver_mask
        self.calc_mode = calc_mode

    def _getSelectedTumor(self):
        tumor_mask = self.tumor_mask

        tumorarea = np.array([np.sum(tumor) for tumor in tumor_mask])
        if self.calc_mode == CalcModeEnum.MultiSlides:
            mean, std = np.mean(tumorarea[tumorarea > 0]), np.std(tumorarea[tumorarea > 0])
            tumor_selected_idx = [z for z, tumor in enumerate(tumorarea) if mean - std < tumor and tumor < mean + std]
        if self.calc_mode == CalcModeEnum.Volumn:
            tumor_selected_idx = [z for z, tumor in enumerate(tumorarea) if tumor > 0]
        if self.calc_mode == CalcModeEnum.SingleSlide:
            tumor_selected_idx = [np.argmax(tumorarea)]
        return tumor_selected_idx

    def calc_mean(self, kernel=np.ones((5, 5), np.uint8), thresh=0.2):
        tumor_mask = self.tumor_mask
        sequence = self.sequence
        liver_mask = self.liver_mask

        tumor_selected_idx = self._getSelectedTumor()

        rim_values, rim_area = 0.0, 0.0
        tumor_values, tumor_area = 0.0, 0.0
        liver_values, liver_area = 0.0, 0.0

        tumor_high_values, tumor_high_area = 0.0, 0.0
        tumor_low_values, tumor_low_area = 0.0, 0.0
        for z in tumor_selected_idx:
            tumor_mask_erode = cv2.erode(tumor_mask[z], kernel)
            tumor = sequence[z][tumor_mask_erode > 0]
            tumor_values += np.sum(tumor)
            tumor_area += np.sum(tumor_mask_erode)

            tumor_mask_dilate = cv2.dilate(tumor_mask[z], kernel)
            rim_mask = tumor_mask_dilate - tumor_mask[z] + tumor_mask[z] - tumor_mask_erode
            rim_values += np.sum(sequence[z][rim_mask > 0])
            rim_area += np.sum(rim_mask)

            liver_only_mask = liver_mask[z] - tumor_mask_dilate
            liver_values += np.sum(sequence[z][liver_only_mask > 0])
            liver_area += np.sum(liver_only_mask)

            # the benchmark of high or low is liver
            thresh_value = np.sum(sequence[z][liver_only_mask > 0]) / np.sum(liver_only_mask)
            tumor_high_values += np.sum(tumor[tumor > thresh_value])
            tumor_high_area += np.sum(tumor > thresh_value)

            tumor_low_values += np.sum(tumor[tumor <= thresh_value])
            tumor_low_area += np.sum(tumor <= thresh_value)

            # showImages([tumor_mask[z], sequence[z][rim_mask > 0]])
        rim_mean = rim_values / rim_area
        tumor_mean = tumor_values / tumor_area
        liver_only_mean = liver_values / liver_area

        if tumor_high_area / tumor_area > thresh:  # only the area of high part is larger than thresh
            tumor_high_mean = tumor_high_values / tumor_high_area if tumor_high_area > 0 else tumor_mean
            tumor_low_mean = tumor_low_values / tumor_low_area if tumor_low_area > 0 else tumor_mean
        else:
            tumor_high_mean = tumor_mean
            tumor_low_mean = tumor_mean

        return rim_mean, tumor_mean, liver_only_mean, tumor_high_mean, tumor_low_mean

    def classifyEhancement(self):
        rim, tumor, liver, tumor_high, _ = self.calc_mean()
        if tumor > liver or tumor_high > liver:
            return EnhancementEnum.Hyper
        else:
            return EnhancementEnum.HypoOrIso

    def isCapsule(self):
        rim, tumor, liver, _, _ = self.calc_mean()
        return True if rim > tumor else False

    def _test_max_radius(self, radius_max):
        tumorarea = np.array([np.sum(tumor) for tumor in tumor_mask])
        tumor_selected_idx = [np.argmax(tumorarea)]
        image, contours, hierarchy = cv2.findContours(tumor_mask[tumor_selected_idx[0]], cv2.RETR_EXTERNAL,
                                                      cv2.CHAIN_APPROX_SIMPLE)
        center, radius = cv2.minEnclosingCircle(contours[0])
        print '{0} == {1}'.format(radius_max, radius)

    def calc_diameter(self, slice_in_spacing=1.0):
        tumor_mask = self.tumor_mask
        tumor_selected_idx = self._getSelectedTumor()

        radius_arr = []
        for z in tumor_selected_idx:
            image, contours, hierarchy = cv2.findContours(tumor_mask[z], cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            center, radius = cv2.minEnclosingCircle(contours[0])
            radius_arr.append(radius)
        radius_max = max(radius_arr)
        # self._test_max_radius(radius_max)

        return 2 * radius_max * slice_in_spacing





'''
sequences = [Aterial's sequence, Post Venous's sequence, Delay's sequence] 
'''
class WashoutExtractor(object):
    def __init__(self, sequences, tumor_masks, liver_masks):
        self.sequences = sequences
        self.tumor_masks = tumor_masks
        self.liver_masks = liver_masks

    def _hyperOrPartly(self):
        return True if self.tumor_delay > self.liver_delay or self.tumor_high_delay > self.liver_delay else False  # hyper or partly hyper

    def _hypoOrPartly(self):
        return True if self.tumor_delay < self.liver_delay or self.tumor_low_delay < self.liver_delay else False  # hypo or partly hypo

    def _washoutOrPartly1(self):
        return True if self.tumor_delay < self.tumor_venous or self.tumor_low_delay < self.tumor_low_venous else False  # washout or partly washout

    def _washoutOrPartly2(self):
        return True if self.tumor_delay < self.tumor_arterial and self.tumor_low_delay < self.tumor_low_arterial else False  # washout and partly washout

    def isWashout(self):
        self.rim_delay, self.tumor_delay, self.liver_delay, self.tumor_high_delay, self.tumor_low_delay = \
            SingleSequenceFeatureExtractor(self.sequences[2], self.tumor_masks[2], self.liver_masks[2]).calc_mean()
        if self._hyperOrPartly():   # hyper or partly hyper
            return False
        if self._hypoOrPartly():    # hypo or partly hypo
            self.rim_venous, self.tumor_venous, self.liver_venous, self.tumor_high_venous, self.tumor_low_venous = \
                SingleSequenceFeatureExtractor(self.sequences[1], self.tumor_masks[1], self.liver_masks[1]).calc_mean()
            if self._washoutOrPartly1():
                return True
            else:
                self.rim_arterial, self.tumor_arterial, self.liver_arterial, self.tumor_high_arterial, self.tumor_low_arterial = \
                    SingleSequenceFeatureExtractor(self.sequences[0], self.tumor_masks[0], self.liver_masks[0]).calc_mean()
                return True if self._washoutOrPartly2() else False
        return False

def showImages(images):
    def cvt2uint8(image):
        min, max = np.min(image), np.max(image)
        image = (image - min) * 255.0 / (max - min) + min
        return image.astype(np.uint8)

    for i, image in enumerate(images):
        cv2.imshow("image {0}".format(i), cvt2uint8(image))
    cv2.waitKey(0)
    cv2.destroyAllWindows()


from MockData import SequenceGenerator
import unittest
class TestMRFeatures(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.seqGen = SequenceGenerator()

    def test_classifyEnhancement_hyper(self):
        sphere_arterial, tumor_mask, liver_mask = self.seqGen.make_sphere(tumor_intensity_percentage=3.0 / 5,
                                                              rim_intensity_percentage=3.0 / 5,
                                                              liver_intensity_percentage=2.0 / 5)
        ehancementType = SingleSequenceFeatureExtractor(sphere_arterial, tumor_mask, liver_mask).classifyEhancement()
        self.assertEqual(EnhancementEnum.Hyper, ehancementType)

    def test_classifyEnhancement_hypo(self):
        sphere, tumor_mask, liver_mask = self.seqGen.make_sphere(tumor_intensity_percentage=1.0 / 5,
                                                              rim_intensity_percentage=2.0 / 5,
                                                              liver_intensity_percentage=2.0 / 5)
        ehancementType = SingleSequenceFeatureExtractor(sphere, tumor_mask, liver_mask).classifyEhancement()
        self.assertEqual(EnhancementEnum.HypoOrIso, ehancementType)

    def test_classifyEnhancement_hyperpartly(self):
        sphere_arterial, tumor_mask, liver_mask = self.seqGen.make_sphere_hyperpart(tumor_intensity_percentage=2.0 / 5,
                                                                                rim_intensity_percentage=4.0 / 5,
                                                                                liver_intensity_percentage=3.0 / 5,
                                                                                hyper_part_percentage=4.0 / 5)
        ehancementType = SingleSequenceFeatureExtractor(sphere_arterial, tumor_mask, liver_mask).classifyEhancement()
        self.assertEqual(EnhancementEnum.Hyper, ehancementType)

    #---------------------
    def test_isCapsule_yes(self):
        sphere_delay, tumor_mask, liver_mask = self.seqGen.make_sphere(tumor_intensity_percentage=2.0 / 5,
                                                           rim_intensity_percentage=4.0 / 5,
                                                           liver_intensity_percentage=3.0 / 5)
        true_or_false = SingleSequenceFeatureExtractor(sphere_delay, tumor_mask, liver_mask).isCapsule()
        self.assertEqual(True, true_or_false)

    def test_isCapsule_no(self):
        sphere_delay, tumor_mask, liver_mask = self.seqGen.make_sphere(tumor_intensity_percentage=3.0 / 5,
                                                           rim_intensity_percentage=2.0 / 5,
                                                           liver_intensity_percentage=3.0 / 5)
        true_or_false = SingleSequenceFeatureExtractor(sphere_delay, tumor_mask, liver_mask).isCapsule()
        self.assertEqual(False, true_or_false)

    # ---------------------
    def test_isWashout_yes(self):
        sphere_arterial, tumor_mask_arterial, liver_mask_arterial = self.seqGen.make_sphere(tumor_intensity_percentage=3.0 / 5,
                                                              rim_intensity_percentage=3.0 / 5,
                                                              liver_intensity_percentage=2.0 / 5)
        sphere_venous, tumor_mask_venous, liver_mask_venous = self.seqGen.make_sphere(tumor_intensity_percentage=2.0 / 5,
                                          rim_intensity_percentage=3.5 / 5,
                                          liver_intensity_percentage=3.0 / 5)
        sphere_delay, tumor_mask_delay, liver_mask_delay = self.seqGen.make_sphere(tumor_intensity_percentage=1.5 / 5,
                                                           rim_intensity_percentage=4.0 / 5,
                                                           liver_intensity_percentage=3.0 / 5)
        true_or_false = WashoutExtractor([sphere_arterial, sphere_venous, sphere_delay],
                                  [tumor_mask_arterial, tumor_mask_venous, tumor_mask_delay],
                                  [liver_mask_arterial, liver_mask_venous, liver_mask_delay]).isWashout()
        self.assertEqual(True, true_or_false)

    def test_isWashout_no(self):
        sphere_arterial, tumor_mask_arterial, liver_mask_arterial = self.seqGen.make_sphere(tumor_intensity_percentage=3.0 / 5,
                                                                                rim_intensity_percentage=3.0 / 5,
                                                                                liver_intensity_percentage=2.0 / 5)
        sphere_venous, tumor_mask_venous, liver_mask_venous = self.seqGen.make_sphere(tumor_intensity_percentage=2.0 / 5,
                                                                          rim_intensity_percentage=3.5 / 5,
                                                                          liver_intensity_percentage=3.0 / 5)
        sphere_delay, tumor_mask_delay, liver_mask_delay = self.seqGen.make_sphere(tumor_intensity_percentage=3.5 / 5,
                                                                       rim_intensity_percentage=4.0 / 5,
                                                                       liver_intensity_percentage=3.0 / 5)
        true_or_false = WashoutExtractor([sphere_arterial, sphere_venous, sphere_delay],
                                  [tumor_mask_arterial, tumor_mask_venous, tumor_mask_delay],
                                  [liver_mask_arterial, liver_mask_venous, liver_mask_delay]).isWashout()
        self.assertEqual(False, true_or_false)

    def test_isWashout_no_partly_hyper(self):
        sphere_arterial, tumor_mask_arterial, liver_mask_arterial = self.seqGen.make_sphere(tumor_intensity_percentage=3.0 / 5,
                                                              rim_intensity_percentage=3.0 / 5,
                                                              liver_intensity_percentage=2.0 / 5)
        sphere_venous, tumor_mask_venous, liver_mask_venous = self.seqGen.make_sphere(tumor_intensity_percentage=2.0 / 5,
                                          rim_intensity_percentage=3.5 / 5,
                                          liver_intensity_percentage=3.0 / 5)
        sphere_delay, tumor_mask_delay, liver_mask_delay = self.seqGen.make_sphere_hyperpart(tumor_intensity_percentage=1.5 / 5,
                                                           rim_intensity_percentage=4.0 / 5,
                                                           liver_intensity_percentage=3.0 / 5,
                                                           hyper_part_percentage=4.0 / 5)
        true_or_false = WashoutExtractor([sphere_arterial, sphere_venous, sphere_delay],
                                  [tumor_mask_arterial, tumor_mask_venous, tumor_mask_delay],
                                  [liver_mask_arterial, liver_mask_venous, liver_mask_delay]).isWashout()
        self.assertEqual(False, true_or_false)

 #   def test_diameter(self):
 #       sphere_arterial, tumor_mask, liver_mask = self.seqGen.make_sphere()
 #       diameter = SingleSequenceFeatureExtractor(sphere_arterial, tumor_mask, liver_mask).calc_diameter()
 #       tumor_radius = self.seqGen.get_config()['objects']['size'][0]
 #       self.assertTrue(abs(diameter-tumor_radius*2) < 1)


# ====================liyulong getresult
def getresult():
     sphere_arterial, tumor_mask, liver_mask = SequenceGenerator().make_sphere(tumor_intensity_percentage=3.0 / 5,

        rim_intensity_percentage=3.0 / 5,
        liver_intensity_percentage=2.0 / 5)
     sphere_venous, tumor_mask_venous, liver_mask_venous = SequenceGenerator().make_sphere(tumor_intensity_percentage=2.0 / 5,
        rim_intensity_percentage=3.5 / 5,
        liver_intensity_percentage=3.0 / 5)
     sphere_delay, tumor_mask_delay, liver_mask_delay = SequenceGenerator().make_sphere_hyperpart(tumor_intensity_percentage=1.5 / 5,
        rim_intensity_percentage=4.0 / 5,
        liver_intensity_percentage=3.0 / 5,
        hyper_part_percentage=4.0 / 5)
     result=dict()
     result['washout']='yes' if WashoutExtractor([sphere_arterial, sphere_venous, sphere_delay],
        [tumor_mask, tumor_mask_venous, tumor_mask_delay],
         [liver_mask, liver_mask_venous, liver_mask_delay]).isWashout() else 'no'
     result['capsule']='yes' if SingleSequenceFeatureExtractor(sphere_delay, tumor_mask, liver_mask).isCapsule() else 'no'
     result['arterialPhaseEnhancement']=SingleSequenceFeatureExtractor(sphere_arterial, tumor_mask, liver_mask).classifyEhancement().name 
     return result

from DicomReader import DicomReader
if __name__ == '__main__':

     # sequence, tumor_mask, liver_mask = SequenceGenerator().make_sphere_hyperpart(
     #     tumor_intensity_percentage=2.0 / 5,
     #     rim_intensity_percentage=4.0 / 5,
     #     liver_intensity_percentage=3.0 / 5,
     #     hyper_part_percentage=4.0 / 5)
     # sequence, tumor_mask, liver_mask = SequenceGenerator().make_sphere(
     #    tumor_intensity_percentage=1.5 / 5,
     #    rim_intensity_percentage=4.0 / 5,
     #    liver_intensity_percentage=3.0 / 5)
     # rim_mean, tumor_in_mean, liver_only_mean, tumor_high_mean, tumor_low_mean = \
     #    SingleSequenceFeatureExtractor(sequence, tumor_mask, liver_mask).calc_mean()
     # print rim_mean, tumor_in_mean, liver_only_mean, tumor_high_mean, tumor_low_mean

     # SingleSequenceFeatureExtractor(sequence, tumor_mask, liver_mask).calc_diameter()
    
     # DicomReader(numpy_arr=sequence).viewSlice()
     # unittest.main()
     # ===========================liyulong=====
     print getresult()



