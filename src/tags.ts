export const ExifTags = {
	// version tags
	0x9000: 'ExifVersion', // EXIF version
	0xa000: 'FlashpixVersion', // Flashpix format version

	// colorspace tags
	0xa001: 'ColorSpace', // Color space information tag

	// image configuration
	0xa002: 'PixelXDimension', // Valid width of meaningful image
	0xa003: 'PixelYDimension', // Valid height of meaningful image
	0x9101: 'ComponentsConfiguration', // Information about channels
	0x9102: 'CompressedBitsPerPixel', // Compressed bits per pixel

	// user information
	0x927c: 'MakerNote', // Any desired information written by the manufacturer
	0x9286: 'UserComment', // Comments by user

	// related file
	0xa004: 'RelatedSoundFile', // Name of related sound file

	// date and time
	0x9003: 'DateTimeOriginal', // Date and time when the original image was generated
	0x9004: 'DateTimeDigitized', // Date and time when the image was stored digitally
	0x9290: 'SubsecTime', // Fractions of seconds for DateTime
	0x9291: 'SubsecTimeOriginal', // Fractions of seconds for DateTimeOriginal
	0x9292: 'SubsecTimeDigitized', // Fractions of seconds for DateTimeDigitized

	// picture-taking conditions
	0x829a: 'ExposureTime', // Exposure time (in seconds)
	0x829d: 'FNumber', // F number
	0x8822: 'ExposureProgram', // Exposure program
	0x8824: 'SpectralSensitivity', // Spectral sensitivity
	0x8827: 'ISOSpeedRatings', // ISO speed rating
	0x8828: 'OECF', // Optoelectric conversion factor
	0x9201: 'ShutterSpeedValue', // Shutter speed
	0x9202: 'ApertureValue', // Lens aperture
	0x9203: 'BrightnessValue', // Value of brightness
	0x9204: 'ExposureBias', // Exposure bias
	0x9205: 'MaxApertureValue', // Smallest F number of lens
	0x9206: 'SubjectDistance', // Distance to subject in meters
	0x9207: 'MeteringMode', // Metering mode
	0x9208: 'LightSource', // Kind of light source
	0x9209: 'Flash', // Flash status
	0x9214: 'SubjectArea', // Location and area of main subject
	0x920a: 'FocalLength', // Focal length of the lens in mm
	0xa20b: 'FlashEnergy', // Strobe energy in BCPS
	0xa20c: 'SpatialFrequencyResponse', //
	0xa20e: 'FocalPlaneXResolution', // Number of pixels in width direction per FocalPlaneResolutionUnit
	0xa20f: 'FocalPlaneYResolution', // Number of pixels in height direction per FocalPlaneResolutionUnit
	0xa210: 'FocalPlaneResolutionUnit', // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
	0xa214: 'SubjectLocation', // Location of subject in image
	0xa215: 'ExposureIndex', // Exposure index selected on camera
	0xa217: 'SensingMethod', // Image sensor type
	0xa300: 'FileSource', // Image source (3 == DSC)
	0xa301: 'SceneType', // Scene type (1 == directly photographed)
	0xa302: 'CFAPattern', // Color filter array geometric pattern
	0xa401: 'CustomRendered', // Special processing
	0xa402: 'ExposureMode', // Exposure mode
	0xa403: 'WhiteBalance', // 1 = auto white balance, 2 = manual
	0xa404: 'DigitalZoomRation', // Digital zoom ratio
	0xa405: 'FocalLengthIn35mmFilm', // Equivalent foacl length assuming 35mm film camera (in mm)
	0xa406: 'SceneCaptureType', // Type of scene
	0xa407: 'GainControl', // Degree of overall image gain adjustment
	0xa408: 'Contrast', // Direction of contrast processing applied by camera
	0xa409: 'Saturation', // Direction of saturation processing applied by camera
	0xa40a: 'Sharpness', // Direction of sharpness processing applied by camera
	0xa40b: 'DeviceSettingDescription', //
	0xa40c: 'SubjectDistanceRange', // Distance to subject

	// other tags
	0xa005: 'InteroperabilityIFDPointer',
	0xa420: 'ImageUniqueID' // Identifier assigned uniquely to each image
};

export const TiffTags = {
	0x0100: 'ImageWidth',
	0x0101: 'ImageHeight',
	0x8769: 'ExifIFDPointer',
	0x8825: 'GPSInfoIFDPointer',
	0xa005: 'InteroperabilityIFDPointer',
	0x0102: 'BitsPerSample',
	0x0103: 'Compression',
	0x0106: 'PhotometricInterpretation',
	0x0112: 'Orientation',
	0x0115: 'SamplesPerPixel',
	0x011c: 'PlanarConfiguration',
	0x0212: 'YCbCrSubSampling',
	0x0213: 'YCbCrPositioning',
	0x011a: 'XResolution',
	0x011b: 'YResolution',
	0x0128: 'ResolutionUnit',
	0x0111: 'StripOffsets',
	0x0116: 'RowsPerStrip',
	0x0117: 'StripByteCounts',
	0x0201: 'JPEGInterchangeFormat',
	0x0202: 'JPEGInterchangeFormatLength',
	0x012d: 'TransferFunction',
	0x013e: 'WhitePoint',
	0x013f: 'PrimaryChromaticities',
	0x0211: 'YCbCrCoefficients',
	0x0214: 'ReferenceBlackWhite',
	0x0132: 'DateTime',
	0x010e: 'ImageDescription',
	0x010f: 'Make',
	0x0110: 'Model',
	0x0131: 'Software',
	0x013b: 'Artist',
	0x8298: 'Copyright'
};

export const GPSTags = {
	0x0000: 'GPSVersionID',
	0x0001: 'GPSLatitudeRef',
	0x0002: 'GPSLatitude',
	0x0003: 'GPSLongitudeRef',
	0x0004: 'GPSLongitude',
	0x0005: 'GPSAltitudeRef',
	0x0006: 'GPSAltitude',
	0x0007: 'GPSTimeStamp',
	0x0008: 'GPSSatellites',
	0x0009: 'GPSStatus',
	0x000a: 'GPSMeasureMode',
	0x000b: 'GPSDOP',
	0x000c: 'GPSSpeedRef',
	0x000d: 'GPSSpeed',
	0x000e: 'GPSTrackRef',
	0x000f: 'GPSTrack',
	0x0010: 'GPSImgDirectionRef',
	0x0011: 'GPSImgDirection',
	0x0012: 'GPSMapDatum',
	0x0013: 'GPSDestLatitudeRef',
	0x0014: 'GPSDestLatitude',
	0x0015: 'GPSDestLongitudeRef',
	0x0016: 'GPSDestLongitude',
	0x0017: 'GPSDestBearingRef',
	0x0018: 'GPSDestBearing',
	0x0019: 'GPSDestDistanceRef',
	0x001a: 'GPSDestDistance',
	0x001b: 'GPSProcessingMethod',
	0x001c: 'GPSAreaInformation',
	0x001d: 'GPSDateStamp',
	0x001e: 'GPSDifferential'
};

// EXIF 2.3 Spec
export const IFD1Tags = {
	0x0100: 'ImageWidth',
	0x0101: 'ImageHeight',
	0x0102: 'BitsPerSample',
	0x0103: 'Compression',
	0x0106: 'PhotometricInterpretation',
	0x0111: 'StripOffsets',
	0x0112: 'Orientation',
	0x0115: 'SamplesPerPixel',
	0x0116: 'RowsPerStrip',
	0x0117: 'StripByteCounts',
	0x011a: 'XResolution',
	0x011b: 'YResolution',
	0x011c: 'PlanarConfiguration',
	0x0128: 'ResolutionUnit',
	0x0201: 'JpegIFOffset', // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
	0x0202: 'JpegIFByteCount', // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
	0x0211: 'YCbCrCoefficients',
	0x0212: 'YCbCrSubSampling',
	0x0213: 'YCbCrPositioning',
	0x0214: 'ReferenceBlackWhite'
};
