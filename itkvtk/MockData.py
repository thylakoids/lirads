#!/usr/bin/env python

import SimpleITK as sitk
import vtk
import numpy as np
import time
from joblib import Parallel, delayed
import copy

'''
@author: qizhong.lin@philips.com

the class SequenceGenerator
SequenceGenerator().make_sphere()   generates the tumor, rim and liver
SequenceGenerator().make_sphere_hyperpart()   generates the tumor, hyper part, rim and liver
'''
class SequenceGenerator(object):
    def __init__(self, slice=245, height=512, width=512,
                 MR_INTENSITY_MIN = -1024, MR_INTENSITY_MAX = 3617):
        self.sphere = np.random.normal(0, (MR_INTENSITY_MAX - MR_INTENSITY_MIN) / 10, (slice, height, width))
        #self.sphere = np.zeros((slice, height, width), dtype=np.float)

        MR_INTENSITY_RANGE = MR_INTENSITY_MAX - MR_INTENSITY_MIN
        self.config = {
            'shape': (slice, height, width),
            'INTENSITY_RANGE': (MR_INTENSITY_MIN, MR_INTENSITY_MAX),
            'objects': {
                'size': [56, 5, 100],
                'intensity': [2.0 / 5 * MR_INTENSITY_RANGE + MR_INTENSITY_MIN,
                              4.0 / 5 * MR_INTENSITY_RANGE + MR_INTENSITY_MIN,
                              3.0 / 5 * MR_INTENSITY_RANGE + MR_INTENSITY_MIN]
            }
        }
    def get_config(self):
        return self.config

    def __make_sphere(self, tumor_intensity_percentage, rim_intensity_percentage, liver_intensity_percentage):
        trl_intensity_ratios = [tumor_intensity_percentage, rim_intensity_percentage, liver_intensity_percentage]
        INTENSITY_RANGE = self.config['INTENSITY_RANGE'][1] - self.config['INTENSITY_RANGE'][0]
        self.config['objects']['intensity'] = [ratio * INTENSITY_RANGE + self.config['INTENSITY_RANGE'][0] for ratio in
                                               trl_intensity_ratios]

        sphere, tumor_mask, liver_mask = make_sphere(self.config)
        #sphere, tumor_mask, liver_mask = make_sphere_ex(self.config)

        return sphere, tumor_mask, liver_mask



    def make_sphere(self,
                    tumor_intensity_percentage=2.0/5,
                    rim_intensity_percentage=4.0/5,
                    liver_intensity_percentage=3.0/5):
        sphere, tumor_mask, liver_mask = self.__make_sphere(tumor_intensity_percentage, rim_intensity_percentage, liver_intensity_percentage)
        sphere += self.sphere

        return (sphere.astype(np.int16), tumor_mask, liver_mask)

    def make_sphere_hyperpart(self,
                    tumor_intensity_percentage=2.0 / 5,
                    rim_intensity_percentage=4.0 / 5,
                    liver_intensity_percentage=3.0 / 5,
                    hyper_part_percentage = 4.0 / 5):
        sphere, tumor_mask, liver_mask = self.__make_sphere(tumor_intensity_percentage, rim_intensity_percentage, liver_intensity_percentage)

        sphere = add_hyper_part(self.config, sphere, hyper_part_percentage)
        sphere += self.sphere

        return (sphere.astype(np.int16), tumor_mask, liver_mask)


from numba import jit

def make_sphere_ex(config):
    (slice, height, width) = config['shape']

    MR_INTENSITY_MIN = config['INTENSITY_RANGE'][0]
    MR_INTENSITY_MAX = config['INTENSITY_RANGE'][1]
    tumor_intensity = config['objects']['intensity'][0]
    rim_intensity = config['objects']['intensity'][1]
    liver_intensity = config['objects']['intensity'][2]
    tumorinner2center = config['objects']['size'][0] - config['objects']['size'][1]
    rim2center = config['objects']['size'][0]
    liver2center = config['objects']['size'][2]

    sphere = np.zeros((slice, height, width), dtype=np.float)
    sphere[0, 0, 0] = MR_INTENSITY_MAX
    sphere[0, 0, 1] = MR_INTENSITY_MIN

    tumor_mask = np.zeros((slice, height, width), dtype=np.uint8)
    liver_mask = np.zeros((slice, height, width), dtype=np.uint8)

    (zc, yc, xc) = (slice/2.0, height/2.0, width/2.0)

    # z, y, x = np.mgrid[0:slice, 0:height, 0:width]
    # distance2center = (z - zc) ** 2 + (y - yc) ** 2 + (x - xc) ** 2

    xx = np.arange(0, width).reshape(1, 1, width)
    yy = np.arange(0, height).reshape(1, height, 1)
    zz = np.arange(0, slice).reshape(slice, 1, 1)
    distance2center = (zz - zc) ** 2 + (yy - yc) ** 2 + (xx - xc) ** 2

    sphere[distance2center < tumorinner2center**2] += tumor_intensity
    sphere[(tumorinner2center**2 <= distance2center) & (distance2center < rim2center**2)] += rim_intensity
    sphere[(rim2center**2 <= distance2center) & (distance2center < liver2center**2)] += liver_intensity
    return sphere, tumor_mask, liver_mask

@jit
def add_hyper_part(config, sphere, part_intensity_ratio):
    (slice, height, width) = config['shape']
    tumor_size = config['objects']['size'][0]
    hyper_cen = (slice/2.0, height/2.0, width/2.0-tumor_size/2)
    hyper2cen = tumor_size/2

    INTENSITY_RANGE = config['INTENSITY_RANGE'][1] - config['INTENSITY_RANGE'][0]
    part_intensity = part_intensity_ratio * INTENSITY_RANGE + config['INTENSITY_RANGE'][0]

    for z in np.arange(slice):
        for y in np.arange(height):
            for x in np.arange(width):
                dz, dy, dx = z-hyper_cen[0], y-hyper_cen[1], x-hyper_cen[2]
                distance2center = dx*dx + dy*dy + dz*dz
                if distance2center < hyper2cen*hyper2cen:
                    sphere[z, y, x] = part_intensity
    return sphere

@jit
def make_sphere(config):
    (slice, height, width) = config['shape']
    tumorinner2center = config['objects']['size'][0] - config['objects']['size'][1]
    rim2center = config['objects']['size'][0]
    liver2center = config['objects']['size'][2]
    tumor_intensity = config['objects']['intensity'][0]
    rim_intensity = config['objects']['intensity'][1]
    liver_intensity = config['objects']['intensity'][2]

    sphere = np.zeros((slice, height, width), dtype=np.float)
    sphere[0, 0, 0] = config['INTENSITY_RANGE'][0]
    sphere[0, 0, 1] = config['INTENSITY_RANGE'][1]

    tumor_mask = np.zeros((slice, height, width), dtype=np.uint8)
    liver_mask = np.zeros((slice, height, width), dtype=np.uint8)

    for z in np.arange(slice):
        for y in np.arange(height):
            for x in np.arange(width):
                dz, dy, dx = z - slice/2.0, y - height/2.0, x - width/2.0
                distance2center = dx*dx + dy*dy + dz*dz
                if distance2center < tumorinner2center*tumorinner2center:
                    sphere[z, y, x] = tumor_intensity
                    tumor_mask[z, y, x] = 1
                    liver_mask[z, y, x] = 1
                if tumorinner2center*tumorinner2center <= distance2center < rim2center*rim2center:
                    sphere[z, y, x] = rim_intensity
                    tumor_mask[z, y, x] = 1
                    liver_mask[z, y, x] = 1
                if rim2center*rim2center <= distance2center < liver2center*liver2center:
                    sphere[z, y, x] = liver_intensity
                    liver_mask[z, y, x] = 1

    return sphere, tumor_mask, liver_mask


from DicomReader import DicomReader
from MrViewer import MrViewer
if __name__ == '__main__':
    ts = time.clock()
    seqGen = SequenceGenerator()
    sphere_pre, _, _ = seqGen.make_sphere(
        tumor_intensity_percentage=1.0/5,
                rim_intensity_percentage=1.0/5,
                liver_intensity_percentage=2.0/5)
    # DicomReader(numpy_arr=sphere_pre).viewSlice()
    # print time.clock() - ts, "seconds process time"
    # exit()
    # sphere_arterial, tumor_mask, liver_mask = seqGen.make_sphere(
    #     tumor_intensity_percentage=3.0 / 5,
    #     rim_intensity_percentage=3.0 / 5,
    #     liver_intensity_percentage=2.0 / 5)
    sphere_arterial, tumor_mask, liver_mask = seqGen.make_sphere_hyperpart(
        tumor_intensity_percentage=2.0 / 5,
        rim_intensity_percentage=4.0 / 5,
        liver_intensity_percentage=3.0 / 5,
        hyper_part_percentage=4.0 / 5)
    sphere_venous, _, _ = seqGen.make_sphere(
        tumor_intensity_percentage=2.0 / 5,
        rim_intensity_percentage=4.0 / 5,
        liver_intensity_percentage=3.0 / 5)
    sphere_delay, _, _ = seqGen.make_sphere(
        tumor_intensity_percentage=2.0 / 5,
        rim_intensity_percentage=5.0 / 5,
        liver_intensity_percentage=3.0 / 5)
    print time.clock() - ts, "seconds process time"
    datas = [
        DicomReader.numpy2vtk(sphere_pre),
        DicomReader.numpy2vtk(sphere_arterial),
        DicomReader.numpy2vtk(sphere_venous),
        DicomReader.numpy2vtk(sphere_delay)
    ]
    MrViewer(datas=datas).viewSlice()




