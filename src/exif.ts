import { ExifTags, TiffTags, GPSTags, IFD1Tags } from './tags';
import { StringValues } from './strings';

interface EXIFStatic {
	getData(url: string, callback: any): any;
	getTag(img: any, tag: any): any;
	getAllTags(img: any): any;
	pretty(img: any): string;
	readFromBinaryFile(file: any): any;
}

class Exif implements EXIFStatic {
	private isXmpEnabled = false;
	private debug = false;

	constructor() {
		if (obj instanceof EXIF) return obj;
		if (!(this instanceof EXIF)) return new EXIF(obj);
		this.EXIFwrapped = obj;
	}

	private static IptcFieldMap = {
		0x78: 'caption',
		0x6e: 'credit',
		0x19: 'keywords',
		0x37: 'dateCreated',
		0x50: 'byline',
		0x55: 'bylineTitle',
		0x7a: 'captionWriter',
		0x69: 'headline',
		0x74: 'copyright',
		0x0f: 'category'
	};

	public enableXmp() {
		this.isXmpEnabled = true;
	}

	public disableXmp() {
		this.isXmpEnabled = false;
	}

	public getData(img, callback) {
		if (
			((self.Image && img instanceof self.Image) ||
				(self.HTMLImageElement && img instanceof self.HTMLImageElement)) &&
			!img.complete
		)
			return false;

		if (!this.imageHasData(img)) {
			this.getImageData(img, callback);
		} else {
			if (callback) {
				callback.call(img);
			}
		}
		return true;
	}

	public getTag(img, tag) {
		if (!this.imageHasData(img)) return;
		return img.exifdata[tag];
	}

	public getIptcTag(img, tag) {
		if (!this.imageHasData(img)) return;
		return img.iptcdata[tag];
	}

	public getAllTags(img) {
		if (!this.imageHasData(img)) return {};
		const a,
			data = img.exifdata,
			tags = {};
		for (a in data) {
			if (data.hasOwnProperty(a)) {
				tags[a] = data[a];
			}
		}
		return tags;
	}

	public getAllIptcTags(img) {
		if (!this.imageHasData(img)) return {};
		const data = img.iptcdata,
			tags = {};
		for (const a in data) {
			if (data.hasOwnProperty(a)) {
				tags[a] = data[a];
			}
		}
		return tags;
	}

	public pretty(img) {
		if (!this.imageHasData(img)) return '';
		let a,
			data = img.exifdata,
			strPretty = '';
		for (a in data) {
			if (data.hasOwnProperty(a)) {
				if (typeof data[a] === 'object') {
					if (data[a] instanceof Number) {
						strPretty +=
							a +
							' : ' +
							data[a] +
							' [' +
							data[a].numerator +
							'/' +
							data[a].denominator +
							']\r\n';
					} else {
						strPretty += a + ' : [' + data[a].length + ' values]\r\n';
					}
				} else {
					strPretty += a + ' : ' + data[a] + '\r\n';
				}
			}
		}
		return strPretty;
	}

	public readFromBinaryFile(file) {
		return this.findEXIFinJPEG(file);
	}

	private addEvent(element, event, handler) {
		if (element.addEventListener) {
			element.addEventListener(event, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent('on' + event, handler);
		}
	}

	private imageHasData(img) {
		return !!img.exifdata;
	}

	private base64ToArrayBuffer(
		base64: string,
		contentType = base64.match(/^data\:([^\;]+)\;base64,/im)[1] ||
			'' /* e.g. 'data:image/jpeg;base64,...' => 'image/jpeg' */
	) {
		base64 = base64.replace(/^data\:([^\;]+)\;base64,/gim, '');
		const binary = atob(base64);
		const len = binary.length;
		const buffer = new ArrayBuffer(len);
		const view = new Uint8Array(buffer);
		for (let i = 0; i < len; i++) {
			view[i] = binary.charCodeAt(i);
		}
		return buffer;
	}

	private objectURLToBlob(url, callback) {
		const http = new XMLHttpRequest();
		http.open('GET', url, true);
		http.responseType = 'blob';
		http.onload = function(e) {
			if (this.status === 200 || this.status === 0) {
				callback(this.response);
			}
		};
		http.send();
	}

	private getImageData(img, callback) {
		const handleBinaryFile = binFile => {
			const data = this.findEXIFinJPEG(binFile);
			img.exifdata = data || {};
			const iptcdata = this.findIPTCinJPEG(binFile);
			img.iptcdata = iptcdata || {};
			if (this.isXmpEnabled) {
				const xmpdata = this.findXMPinJPEG(binFile);
				img.xmpdata = xmpdata || {};
			}
			if (callback) {
				callback.call(img);
			}
		};

		if (img.src) {
			if (/^data\:/i.test(img.src)) {
				// Data URI
				const arrayBuffer = this.base64ToArrayBuffer(img.src);
				handleBinaryFile(arrayBuffer);
			} else if (/^blob\:/i.test(img.src)) {
				// Object URL
				const fileReader = new FileReader();
				fileReader.onload = function(e) {
					handleBinaryFile(e.target.result);
				};
				this.objectURLToBlob(img.src, function(blob) {
					fileReader.readAsArrayBuffer(blob);
				});
			} else {
				let http = new XMLHttpRequest();
				http.onload = function() {
					if (this.status == 200 || this.status === 0) {
						handleBinaryFile(http.response);
					} else {
						throw 'Could not load image';
					}
					http = null;
				};
				http.open('GET', img.src, true);
				http.responseType = 'arraybuffer';
				http.send(null);
			}
		} else if (
			self.FileReader &&
			(img instanceof self.Blob || img instanceof self.File)
		) {
			const fileReader = new FileReader();
			fileReader.onload = e => {
				if (this.debug)
					console.log(
						'Got file of length ' + (e.target.result as ArrayBuffer).byteLength
					);
				handleBinaryFile(e.target.result);
			};

			fileReader.readAsArrayBuffer(img);
		}
	}

	private findEXIFinJPEG(file) {
		const dataView = new DataView(file);

		if (this.debug) console.log('Got file of length ' + file.byteLength);
		if (dataView.getUint8(0) !== 0xff || dataView.getUint8(1) !== 0xd8) {
			if (this.debug) console.log('Not a valid JPEG');
			return false; // not a valid jpeg
		}

		const length = file.byteLength;
		let offset = 2,
			marker;

		while (offset < length) {
			if (dataView.getUint8(offset) !== 0xff) {
				if (this.debug)
					console.log(
						'Not a valid marker at offset ' +
							offset +
							', found: ' +
							dataView.getUint8(offset)
					);
				return false; // not a valid marker, something is wrong
			}

			marker = dataView.getUint8(offset + 1);
			if (this.debug) console.log(marker);

			// we could implement handling for other markers here,
			// but we're only looking for 0xFFE1 for EXIF data

			if (marker === 225) {
				if (this.debug) console.log('Found 0xFFE1 marker');

				return this.readEXIFData(
					dataView,
					offset + 4,
					dataView.getUint16(offset + 2) - 2
				);

				// offset += 2 + file.getShortAt(offset+2, true);
			} else {
				offset += 2 + dataView.getUint16(offset + 2);
			}
		}
	}

	private findIPTCinJPEG(file) {
		const dataView = new DataView(file);

		if (this.debug) console.log('Got file of length ' + file.byteLength);
		if (dataView.getUint8(0) !== 0xff || dataView.getUint8(1) !== 0xd8) {
			if (this.debug) console.log('Not a valid JPEG');
			return false; // not a valid jpeg
		}

		const offset = 2,
			length = file.byteLength;

		const isFieldSegmentStart = (dataView, offset) => {
			return (
				dataView.getUint8(offset) === 0x38 &&
				dataView.getUint8(offset + 1) === 0x42 &&
				dataView.getUint8(offset + 2) === 0x49 &&
				dataView.getUint8(offset + 3) === 0x4d &&
				dataView.getUint8(offset + 4) === 0x04 &&
				dataView.getUint8(offset + 5) === 0x04
			);
		};

		while (offset < length) {
			if (isFieldSegmentStart(dataView, offset)) {
				// Get the length of the name header (which is padded to an even number of bytes)
				let nameHeaderLength = dataView.getUint8(offset + 7);
				if (nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
				// Check for pre photoshop 6 format
				if (nameHeaderLength === 0) {
					// Always 4
					nameHeaderLength = 4;
				}

				const startOffset = offset + 8 + nameHeaderLength;
				const sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

				return this.readIPTCData(file, startOffset, sectionLength);

				break;
			}

			// Not the marker, continue searching
			offset++;
		}
	}
	private readIPTCData(file, startOffset, sectionLength) {
		const dataView = new DataView(file);
		const data = {};
		let fieldValue, fieldName, dataSize, segmentType, segmentSize;
		let segmentStartPos = startOffset;
		while (segmentStartPos < startOffset + sectionLength) {
			if (
				dataView.getUint8(segmentStartPos) === 0x1c &&
				dataView.getUint8(segmentStartPos + 1) === 0x02
			) {
				segmentType = dataView.getUint8(segmentStartPos + 2);
				if (segmentType in Exif.IptcFieldMap) {
					dataSize = dataView.getInt16(segmentStartPos + 3);
					segmentSize = dataSize + 5;
					fieldName = Exif.IptcFieldMap[segmentType];
					fieldValue = this.getStringFromDB(
						dataView,
						segmentStartPos + 5,
						dataSize
					);
					// Check if we already stored a value with this name
					if (data.hasOwnProperty(fieldName)) {
						// Value already stored with this name, create multivalue field
						if (data[fieldName] instanceof Array) {
							data[fieldName].push(fieldValue);
						} else {
							data[fieldName] = [data[fieldName], fieldValue];
						}
					} else {
						data[fieldName] = fieldValue;
					}
				}
			}
			segmentStartPos++;
		}
		return data;
	}

	private readTags(file, tiffStart, dirStart, strings, bigEnd) {
		let entries = file.getUint16(dirStart, !bigEnd),
			tags = {},
			entryOffset,
			tag,
			i;

		for (i = 0; i < entries; i++) {
			entryOffset = dirStart + i * 12 + 2;
			tag = strings[file.getUint16(entryOffset, !bigEnd)];
			if (!tag && this.debug)
				console.log('Unknown tag: ' + file.getUint16(entryOffset, !bigEnd));
			tags[tag] = this.readTagValue(
				file,
				entryOffset,
				tiffStart,
				dirStart,
				bigEnd
			);
		}
		return tags;
	}

	private readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
		let type = file.getUint16(entryOffset + 2, !bigEnd),
			numValues = file.getUint32(entryOffset + 4, !bigEnd),
			valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
			offset,
			vals,
			val,
			n,
			numerator,
			denominator;

		switch (type) {
			case 1: // byte, 8-bit unsigned int
			case 7: // undefined, 8-bit byte, value depending on field
				if (numValues === 1) {
					return file.getUint8(entryOffset + 8, !bigEnd);
				} else {
					offset = numValues > 4 ? valueOffset : entryOffset + 8;
					vals = [];
					for (n = 0; n < numValues; n++) {
						vals[n] = file.getUint8(offset + n);
					}
					return vals;
				}

			case 2: // ascii, 8-bit byte
				offset = numValues > 4 ? valueOffset : entryOffset + 8;
				return this.getStringFromDB(file, offset, numValues - 1);

			case 3: // short, 16 bit int
				if (numValues === 1) {
					return file.getUint16(entryOffset + 8, !bigEnd);
				} else {
					offset = numValues > 2 ? valueOffset : entryOffset + 8;
					vals = [];
					for (n = 0; n < numValues; n++) {
						vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
					}
					return vals;
				}

			case 4: // long, 32 bit int
				if (numValues === 1) {
					return file.getUint32(entryOffset + 8, !bigEnd);
				} else {
					vals = [];
					for (n = 0; n < numValues; n++) {
						vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
					}
					return vals;
				}

			case 5: // rational = two long values, first is numerator, second is denominator
				if (numValues === 1) {
					numerator = file.getUint32(valueOffset, !bigEnd);
					denominator = file.getUint32(valueOffset + 4, !bigEnd);
					val = new Number(numerator / denominator);
					val.numerator = numerator;
					val.denominator = denominator;
					return val;
				} else {
					vals = [];
					for (n = 0; n < numValues; n++) {
						numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
						denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
						vals[n] = new Number(numerator / denominator);
						vals[n].numerator = numerator;
						vals[n].denominator = denominator;
					}
					return vals;
				}

			case 9: // slong, 32 bit signed int
				if (numValues === 1) {
					return file.getInt32(entryOffset + 8, !bigEnd);
				} else {
					vals = [];
					for (n = 0; n < numValues; n++) {
						vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
					}
					return vals;
				}

			case 10: // signed rational, two slongs, first is numerator, second is denominator
				if (numValues === 1) {
					return (
						file.getInt32(valueOffset, !bigEnd) /
						file.getInt32(valueOffset + 4, !bigEnd)
					);
				} else {
					vals = [];
					for (n = 0; n < numValues; n++) {
						vals[n] =
							file.getInt32(valueOffset + 8 * n, !bigEnd) /
							file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
					}
					return vals;
				}
			default:
				throw new Error('Could not determine file type');
		}
	}

	/**
	 * Given an IFD (Image File Directory) start offset
	 * returns an offset to next IFD or 0 if it's the last IFD.
	 */
	private getNextIFDOffset(dataView, dirStart, bigEnd) {
		//the first 2bytes means the number of directory entries contains in this IFD
		const entries = dataView.getUint16(dirStart, !bigEnd);

		// After last directory entry, there is a 4bytes of data,
		// it means an offset to next IFD.
		// If its value is '0x00000000', it means this is the last IFD and there is no linked IFD.

		return dataView.getUint32(dirStart + 2 + entries * 12, !bigEnd); // each entry is 12 bytes long
	}

	private readThumbnailImage(dataView, tiffStart, firstIFDOffset, bigEnd) {
		// get the IFD1 offset
		const IFD1OffsetPointer = this.getNextIFDOffset(
			dataView,
			tiffStart + firstIFDOffset,
			bigEnd
		);

		if (!IFD1OffsetPointer) {
			// console.log('******** IFD1Offset is empty, image thumb not found ********');
			return {};
		} else if (IFD1OffsetPointer > dataView.byteLength) {
			// this should not happen
			// console.log('******** IFD1Offset is outside the bounds of the DataView ********');
			return {};
		}
		// console.log('*******  thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

		const thumbTags = this.readTags(
			dataView,
			tiffStart,
			tiffStart + IFD1OffsetPointer,
			IFD1Tags,
			bigEnd
		);

		// EXIF 2.3 specification for JPEG format thumbnail

		// If the value of Compression(0x0103) Tag in IFD1 is '6', thumbnail image format is JPEG.
		// Most of Exif image uses JPEG format for thumbnail. In that case, you can get offset of thumbnail
		// by JpegIFOffset(0x0201) Tag in IFD1, size of thumbnail by JpegIFByteCount(0x0202) Tag.
		// Data format is ordinary JPEG format, starts from 0xFFD8 and ends by 0xFFD9. It seems that
		// JPEG format and 160x120pixels of size are recommended thumbnail format for Exif2.1 or later.

		if (thumbTags.Compression) {
			// console.log('Thumbnail image found!');

			switch (thumbTags.Compression) {
				case 6:
					// console.log('Thumbnail image format is JPEG');
					if (thumbTags.JpegIFOffset && thumbTags.JpegIFByteCount) {
						// extract the thumbnail
						const tOffset = tiffStart + thumbTags.JpegIFOffset;
						const tLength = thumbTags.JpegIFByteCount;
						thumbTags.blob = new Blob(
							[new Uint8Array(dataView.buffer, tOffset, tLength)],
							{
								type: 'image/jpeg'
							}
						);
					}
					break;

				case 1:
					console.log(
						'Thumbnail image format is TIFF, which is not implemented.'
					);
					break;
				default:
					console.log(
						"Unknown thumbnail image format '%s'",
						thumbTags.Compression
					);
			}
		} else if (thumbTags.PhotometricInterpretation == 2) {
			console.log('Thumbnail image format is RGB, which is not implemented.');
		}
		return thumbTags;
	}

	private getStringFromDB(buffer, start, length) {
		let outstr = '';
		for (let n = start; n < start + length; n++) {
			outstr += String.fromCharCode(buffer.getUint8(n));
		}
		return outstr;
	}

	private readEXIFData(file, start) {
		if (this.getStringFromDB(file, start, 4) != 'Exif') {
			if (this.debug)
				console.log(
					'Not valid EXIF data! ' + this.getStringFromDB(file, start, 4)
				);
			return false;
		}

		let bigEnd,
			tags,
			tag,
			exifData,
			gpsData,
			tiffOffset = start + 6;

		// test for TIFF validity and endianness
		if (file.getUint16(tiffOffset) == 0x4949) {
			bigEnd = false;
		} else if (file.getUint16(tiffOffset) == 0x4d4d) {
			bigEnd = true;
		} else {
			if (this.debug) console.log('Not valid TIFF data! (no 0x4949 or 0x4D4D)');
			return false;
		}

		if (file.getUint16(tiffOffset + 2, !bigEnd) != 0x002a) {
			if (this.debug) console.log('Not valid TIFF data! (no 0x002A)');
			return false;
		}

		const firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

		if (firstIFDOffset < 0x00000008) {
			if (this.debug)
				console.log(
					'Not valid TIFF data! (First offset less than 8)',
					file.getUint32(tiffOffset + 4, !bigEnd)
				);
			return false;
		}

		tags = this.readTags(
			file,
			tiffOffset,
			tiffOffset + firstIFDOffset,
			TiffTags,
			bigEnd
		);

		if (tags.ExifIFDPointer) {
			exifData = this.readTags(
				file,
				tiffOffset,
				tiffOffset + tags.ExifIFDPointer,
				ExifTags,
				bigEnd
			);
			for (tag in exifData) {
				switch (tag) {
					case 'LightSource':
					case 'Flash':
					case 'MeteringMode':
					case 'ExposureProgram':
					case 'SensingMethod':
					case 'SceneCaptureType':
					case 'SceneType':
					case 'CustomRendered':
					case 'WhiteBalance':
					case 'GainControl':
					case 'Contrast':
					case 'Saturation':
					case 'Sharpness':
					case 'SubjectDistanceRange':
					case 'FileSource':
						exifData[tag] = StringValues[tag][exifData[tag]];
						break;

					case 'ExifVersion':
					case 'FlashpixVersion':
						exifData[tag] = String.fromCharCode(
							exifData[tag][0],
							exifData[tag][1],
							exifData[tag][2],
							exifData[tag][3]
						);
						break;

					case 'ComponentsConfiguration':
						exifData[tag] =
							StringValues.Components[exifData[tag][0]] +
							StringValues.Components[exifData[tag][1]] +
							StringValues.Components[exifData[tag][2]] +
							StringValues.Components[exifData[tag][3]];
						break;
				}
				tags[tag] = exifData[tag];
			}
		}

		if (tags.GPSInfoIFDPointer) {
			gpsData = this.readTags(
				file,
				tiffOffset,
				tiffOffset + tags.GPSInfoIFDPointer,
				GPSTags,
				bigEnd
			);
			for (tag in gpsData) {
				switch (tag) {
					case 'GPSVersionID':
						gpsData[tag] =
							gpsData[tag][0] +
							'.' +
							gpsData[tag][1] +
							'.' +
							gpsData[tag][2] +
							'.' +
							gpsData[tag][3];
						break;
				}
				tags[tag] = gpsData[tag];
			}
		}

		// extract thumbnail
		tags.thumbnail = this.readThumbnailImage(
			file,
			tiffOffset,
			firstIFDOffset,
			bigEnd
		);

		return tags;
	}

	private findXMPinJPEG(file) {
		if (!('DOMParser' in self)) {
			// console.warn('XML parsing not supported without DOMParser');
			return;
		}
		const dataView = new DataView(file);

		if (this.debug) console.log('Got file of length ' + file.byteLength);
		if (dataView.getUint8(0) != 0xff || dataView.getUint8(1) != 0xd8) {
			if (this.debug) console.log('Not a valid JPEG');
			return false; // not a valid jpeg
		}

		let offset = 2,
			length = file.byteLength,
			dom = new DOMParser();

		while (offset < length - 4) {
			if (this.getStringFromDB(dataView, offset, 4) == 'http') {
				const startOffset = offset - 1;
				const sectionLength = dataView.getUint16(offset - 2) - 1;
				let xmpString = this.getStringFromDB(
					dataView,
					startOffset,
					sectionLength
				);
				const xmpEndIndex = xmpString.indexOf('xmpmeta>') + 8;
				xmpString = xmpString.substring(
					xmpString.indexOf('<x:xmpmeta'),
					xmpEndIndex
				);

				const indexOfXmp = xmpString.indexOf('x:xmpmeta') + 10;
				//Many custom written programs embed xmp/xml without any namespace. Following are some of them.
				//Without these namespaces, XML is thought to be invalid by parsers
				xmpString =
					xmpString.slice(0, indexOfXmp) +
					'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" ' +
					'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
					'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" ' +
					'xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" ' +
					'xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" ' +
					'xmlns:exif="http://ns.adobe.com/exif/1.0/" ' +
					'xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" ' +
					'xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" ' +
					'xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" ' +
					'xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" ' +
					'xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" ' +
					xmpString.slice(indexOfXmp);

				const domDocument = dom.parseFromString(xmpString, 'text/xml');
				return this.xml2Object(domDocument);
			} else {
				offset++;
			}
		}
	}

	private xml2json(xml) {
		const json = {};

		if (xml.nodeType == 1) {
			// element node
			if (xml.attributes.length > 0) {
				json['@attributes'] = {};
				for (let j = 0; j < xml.attributes.length; j++) {
					const attribute = xml.attributes.item(j);
					json['@attributes'][attribute.nodeName] = attribute.nodeValue;
				}
			}
		} else if (xml.nodeType == 3) {
			// text node
			return xml.nodeValue;
		}

		// deal with children
		if (xml.hasChildNodes()) {
			for (let i = 0; i < xml.childNodes.length; i++) {
				const child = xml.childNodes.item(i);
				const nodeName = child.nodeName;
				if (json[nodeName] == null) {
					json[nodeName] = this.xml2json(child);
				} else {
					if (json[nodeName].push == null) {
						const old = json[nodeName];
						json[nodeName] = [];
						json[nodeName].push(old);
					}
					json[nodeName].push(this.xml2json(child));
				}
			}
		}

		return json;
	}

	private xml2Object(xml) {
		try {
			let obj = {};
			if (xml.children.length > 0) {
				for (let i = 0; i < xml.children.length; i++) {
					const item = xml.children.item(i);
					const attributes = item.attributes;
					for (const idx in attributes) {
						const itemAtt = attributes[idx];
						const dataKey = itemAtt.nodeName;
						const dataValue = itemAtt.nodeValue;

						if (dataKey !== undefined) {
							obj[dataKey] = dataValue;
						}
					}
					const nodeName = item.nodeName;

					if (typeof obj[nodeName] === 'undefined') {
						obj[nodeName] = this.xml2json(item);
					} else {
						if (typeof obj[nodeName].push === 'undefined') {
							const old = obj[nodeName];

							obj[nodeName] = [];
							obj[nodeName].push(old);
						}
						obj[nodeName].push(this.xml2json(item));
					}
				}
			} else {
				obj = xml.textContent;
			}
			return obj;
		} catch (e) {
			console.log(e.message);
		}
	}
}

export = Exif;
