import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export const rS = (size: number) => scale(size);
export const rVS = (size: number) => verticalScale(size);
export const rMS = (size: number, factor?: number) => moderateScale(size, factor);