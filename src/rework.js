const omvandlaData = async (data) => {
  var LZString = (function () {
    // private property
    var f = String.fromCharCode;
    var keyStrBase64 =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var keyStrUriSafe =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    var baseReverseDic = {};

    function getBaseValue(alphabet, character) {
      if (!baseReverseDic[alphabet]) {
        baseReverseDic[alphabet] = {};
        for (var i = 0; i < alphabet.length; i++) {
          baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
      }
      return baseReverseDic[alphabet][character];
    }

    var LZString = {
      compressToBase64: function (input) {
        if (input == null) return "";
        var res = LZString._compress(input, 6, function (a) {
          return keyStrBase64.charAt(a);
        });
        switch (
          res.length % 4 // To produce valid Base64
        ) {
          default: // When could this happen ?
          case 0:
            return res;
          case 1:
            return res + "===";
          case 2:
            return res + "==";
          case 3:
            return res + "=";
        }
      },

      decompressFromBase64: function (input) {
        if (input == null) return "";
        if (input == "") return null;
        return LZString._decompress(input.length, 32, function (index) {
          return getBaseValue(keyStrBase64, input.charAt(index));
        });
      },

      compressToUTF16: function (input) {
        if (input == null) return "";
        return (
          LZString._compress(input, 15, function (a) {
            return f(a + 32);
          }) + " "
        );
      },

      decompressFromUTF16: function (compressed) {
        if (compressed == null) return "";
        if (compressed == "") return null;
        return LZString._decompress(compressed.length, 16384, function (index) {
          return compressed.charCodeAt(index) - 32;
        });
      },

      //compress into uint8array (UCS-2 big endian format)
      compressToUint8Array: function (uncompressed) {
        var compressed = LZString.compress(uncompressed);
        var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character

        for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
          var current_value = compressed.charCodeAt(i);
          buf[i * 2] = current_value >>> 8;
          buf[i * 2 + 1] = current_value % 256;
        }
        return buf;
      },

      //decompress from uint8array (UCS-2 big endian format)
      decompressFromUint8Array: function (compressed) {
        if (compressed === null || compressed === undefined) {
          return LZString.decompress(compressed);
        } else {
          var buf = new Array(compressed.length / 2); // 2 bytes per character
          for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
            buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
          }

          var result = [];
          buf.forEach(function (c) {
            result.push(f(c));
          });
          return LZString.decompress(result.join(""));
        }
      },

      //compress into a string that is already URI encoded
      compressToEncodedURIComponent: function (input) {
        if (input == null) return "";
        return LZString._compress(input, 6, function (a) {
          return keyStrUriSafe.charAt(a);
        });
      },

      //decompress from an output of compressToEncodedURIComponent
      decompressFromEncodedURIComponent: function (input) {
        if (input == null) return "";
        if (input == "") return null;
        input = input.replace(/ /g, "+");
        return LZString._decompress(input.length, 32, function (index) {
          return getBaseValue(keyStrUriSafe, input.charAt(index));
        });
      },

      compress: function (uncompressed) {
        return LZString._compress(uncompressed, 16, function (a) {
          return f(a);
        });
      },
      _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
        if (uncompressed == null) return "";
        var i,
          value,
          context_dictionary = {},
          context_dictionaryToCreate = {},
          context_c = "",
          context_wc = "",
          context_w = "",
          context_enlargeIn = 2, // Compensate for the first entry which should not count
          context_dictSize = 3,
          context_numBits = 2,
          context_data = [],
          context_data_val = 0,
          context_data_position = 0,
          ii;

        for (ii = 0; ii < uncompressed.length; ii += 1) {
          context_c = uncompressed.charAt(ii);
          if (
            !Object.prototype.hasOwnProperty.call(context_dictionary, context_c)
          ) {
            context_dictionary[context_c] = context_dictSize++;
            context_dictionaryToCreate[context_c] = true;
          }

          context_wc = context_w + context_c;
          if (
            Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)
          ) {
            context_w = context_wc;
          } else {
            if (
              Object.prototype.hasOwnProperty.call(
                context_dictionaryToCreate,
                context_w
              )
            ) {
              if (context_w.charCodeAt(0) < 256) {
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 8; i++) {
                  context_data_val = (context_data_val << 1) | (value & 1);
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              } else {
                value = 1;
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = (context_data_val << 1) | value;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = 0;
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 16; i++) {
                  context_data_val = (context_data_val << 1) | (value & 1);
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              delete context_dictionaryToCreate[context_w];
            } else {
              value = context_dictionary[context_w];
              for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            // Add wc to the dictionary.
            context_dictionary[context_wc] = context_dictSize++;
            context_w = String(context_c);
          }
        }

        // Output the code for w.
        if (context_w !== "") {
          if (
            Object.prototype.hasOwnProperty.call(
              context_dictionaryToCreate,
              context_w
            )
          ) {
            if (context_w.charCodeAt(0) < 256) {
              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
              }
              value = context_w.charCodeAt(0);
              for (i = 0; i < 8; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            } else {
              value = 1;
              for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | value;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = 0;
              }
              value = context_w.charCodeAt(0);
              for (i = 0; i < 16; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            delete context_dictionaryToCreate[context_w];
          } else {
            value = context_dictionary[context_w];
            for (i = 0; i < context_numBits; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
        }

        // Mark the end of the stream
        value = 2;
        for (i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }

        // Flush the last char
        while (true) {
          context_data_val = context_data_val << 1;
          if (context_data_position == bitsPerChar - 1) {
            context_data.push(getCharFromInt(context_data_val));
            break;
          } else context_data_position++;
        }
        return context_data.join("");
      },

      decompress: function (compressed) {
        if (compressed == null) return "";
        if (compressed == "") return null;
        return LZString._decompress(compressed.length, 32768, function (index) {
          return compressed.charCodeAt(index);
        });
      },

      _decompress: function (length, resetValue, getNextValue) {
        var dictionary = [],
          next,
          enlargeIn = 4,
          dictSize = 4,
          numBits = 3,
          entry = "",
          result = [],
          i,
          w,
          bits,
          resb,
          maxpower,
          power,
          c,
          data = { val: getNextValue(0), position: resetValue, index: 1 };

        for (i = 0; i < 3; i += 1) {
          dictionary[i] = i;
        }

        bits = 0;
        maxpower = Math.pow(2, 2);
        power = 1;
        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }

        switch ((next = bits)) {
          case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            c = f(bits);
            break;
          case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            c = f(bits);
            break;
          case 2:
            return "";
        }
        dictionary[3] = c;
        w = c;
        result.push(c);
        while (true) {
          if (data.index > length) {
            return "";
          }

          bits = 0;
          maxpower = Math.pow(2, numBits);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }

          switch ((c = bits)) {
            case 0:
              bits = 0;
              maxpower = Math.pow(2, 8);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }

              dictionary[dictSize++] = f(bits);
              c = dictSize - 1;
              enlargeIn--;
              break;
            case 1:
              bits = 0;
              maxpower = Math.pow(2, 16);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              dictionary[dictSize++] = f(bits);
              c = dictSize - 1;
              enlargeIn--;
              break;
            case 2:
              return result.join("");
          }

          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }

          if (dictionary[c]) {
            entry = dictionary[c];
          } else {
            if (c === dictSize) {
              entry = w + w.charAt(0);
            } else {
              return null;
            }
          }
          result.push(entry);

          // Add w+entry[0] to the dictionary.
          dictionary[dictSize++] = w + entry.charAt(0);
          enlargeIn--;

          w = entry;

          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }
        }
      },
    };
    return LZString;
  })();

  if (typeof define === "function" && define.amd) {
    define(function () {
      return LZString;
    });
  } else if (typeof module !== "undefined" && module != null) {
    module.exports = LZString;
  } else if (typeof angular !== "undefined" && angular != null) {
    angular.module("LZString", []).factory("LZString", function () {
      return LZString;
    });
  }
  function generateUniqueId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
  function formateraGrid(gammalData) {
    if (gammalData) {
      const rader = gammalData.rows;
      const kolumner = gammalData.columns;
      console.log(gammalData);
      nyGrid = Array.from({ length: rader }, () =>
        Array.from({ length: kolumner }, () => ({
          id: null,
          person: 0,
        }))
      ).map((rad, radIndex) =>
        rad.map((ruta, kolumnIndex) => {
          let boxnummer = radIndex * kolumner + kolumnIndex;
          var box = { id: null, person: 0 };

          if (gammalData.keyChange && Array.isArray(gammalData.keyChange)) {
            boxnummer = gammalData.keyChange.find(
              (change) => change.key === boxnummer
            )
              ? gammalData.keyChange.find((change) => change.key === boxnummer)
                  .value
              : boxnummer;
          }

          if (gammalData.filledBoxes && Array.isArray(gammalData.filledBoxes)) {
            if (
              gammalData.filledBoxes.some(
                (box) => parseInt(box.split("-")[1]) === boxnummer
              )
            ) {
              box.id = generateUniqueId();
            }

            if (gammalData.boxNames && Array.isArray(gammalData.boxNames)) {
              const match = gammalData.boxNames.find(
                (box) => parseInt(box.key.split("-")[1]) === boxnummer
              );
              box.person = match ? match.value : 0;
            }
          }

          return box;
        })
      );
      return nyGrid;
    }
  }
  parsedData = await JSON.parse(data);
  const formateradData = await Promise.all(
    parsedData.map(async (spar) => {
      let id = spar.split(":")[0];
      let value = await LZString.decompressFromEncodedURIComponent(
        spar.split(":")[1]
      );
      value = JSON.parse(value);
      return {
        typ: id.split("_")[1],
        namn: id.split("_")[0],
        id: id,
        value: value,
      };
    })
  );

  const klassrum = await Promise.all(
    formateradData
      .filter((spar) => spar.typ === "gridValues")
      .map(async (spar) => {
        const grid = await formateraGrid(spar.value);
        return {
          grid: grid,
          id: spar.id,
          namn: spar.namn,
          cols: spar.value && spar.value.columns,
          rows: spar.value && spar.value.rows,
        };
      })
  );

  const klasser = formateradData
    .filter((spar) => spar.typ === "nameValues")
    .map((spar) => {
      return { id: spar.id, namn: spar.namn, personer: spar.value.names };
    });

  const placeringar = await Promise.all(
    formateradData
      .filter((spar) => spar.typ === "values")
      .map(async (spar) => {
        let grid = null;
        if (spar.value) {
          grid = await formateraGrid(spar.value);
        }

        let klassnamn = null;
        let klassrumsnamn = null;

        let klassrumsmatch = null;
        let klassmatch = null;

        const nyttKlassId = generateUniqueId();
        const nyttKlassrumsId = generateUniqueId();

        if (spar.namn.includes(" i ") && spar.value) {
          klassrumsnamn = spar.namn.split(" i ")[1];
          klassrumsmatch = klassrum.find(
            (klassrum) => klassrum.namn === klassrumsnamn
          );
          if (!klassrumsmatch) {
            klassrum.push({
              grid: grid,
              id: nyttKlassrumsId,
              namn: klassrumsnamn,
              cols: grid[0].length,
              rows: grid.length,
            });
          }

          klassnamn = spar.namn.split(" i ")[0];
          klassmatch = klasser.find((klass) => klass.namn === klassnamn);
          if (!klassmatch) {
            klasser.push({
              id: nyttKlassId,
              namn: klassnamn,
              personer: spar.value.names,
            });
          }
        }
        if (!spar.value) {
          grid = klassrumsmatch && klassrumsmatch.grid;
        }

        return (
          grid && {
            id: spar.id,
            namn: spar.namn,
            klass: {
              id: klassmatch ? klassmatch.id : nyttKlassId,
              namn: klassnamn || "okänt",
              personer: spar.value && spar.value.names,
            },
            klassrum: {
              id: klassrumsmatch ? klassrumsmatch.id : nyttKlassrumsId,
              namn: klassrumsnamn || "okänt",
              grid: grid,
              cols: grid[0].length,
              rows: grid.length,
            },
          }
        );
      })
  );

  return {
    klasser: klasser,
    klassrum: klassrum,
    placeringar: placeringar.filter((placering) => placering),
  };
};
