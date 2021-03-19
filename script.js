const Keyboard = {
    elements: {
      main: null,
      keysContainer: null,
      keys: []
    },
  
    eventHandlers: {
      oninput: null,
      onclose: null
    },
  
    properties: {
      value: "",
      capsLock: false,
      EnRu: false,
      shift: false,
      audio: true,
      voice: false
    },
  
    init() {
      // Create main elements
      this.elements.main = document.createElement("div");
      this.elements.keysContainer = document.createElement("div");
      //this.elements.audioContainer = document.createElement("div");
  
      // Setup main elements
      this.elements.main.classList.add("keyboard", "keyboard--hidden");
      this.elements.keysContainer.classList.add("keyboard__keys");
      this.elements.keysContainer.appendChild(this._createKeys());
      //this.elements.audioContainer.classList.add("keyboard__audio");
      //this.elements.audioContainer.appendChild(this._createAudio());
  
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
  
      // Add to DOM
      this.elements.main.appendChild(this.elements.keysContainer);
      //this.elements.main.appendChild(this.elements.audioContainer);
      document.body.appendChild(this.elements.main);
  
      // Automatically use keyboard for elements with .use-keyboard-input
      document.querySelectorAll(".use-keyboard-input").forEach(element => {
        element.addEventListener("focus", () => {
          this.open(element.value, currentValue => {
            element.value = currentValue;
          });
        });
      });

      const body = document.querySelector("body");

      document.addEventListener("keydown", (e) => {
        let position = document.querySelector(".use-keyboard-input").selectionStart;
        let firstPart = this.properties.value.slice(0, position);
        let secondPart = this.properties.value.slice(position);

          body.lastElementChild.firstElementChild.childNodes.forEach( b => {
            if (e.code == "Key" + b.innerText.toUpperCase()) {
              b.classList.add("keyboard__key--viaKeyboard");
              this.properties.value = firstPart + b.innerText + secondPart;
            } else if (e.code == "CapsLock" && b.innerText == "keyboard_capslock") {
              b.classList.add("keyboard__key--viaKeyboard");
              b.click();
            } else if (e.code == "ShiftLeft" && b.innerText == "keyboard_control") {
              b.classList.add("keyboard__key--viaKeyboard");
              b.click();
            } else if (e.code == "Enter" && b.innerText == "keyboard_return") {
              b.classList.add("keyboard__key--viaKeyboard");
              this.properties.value = firstPart + "\n" + secondPart;
            } else if (e.code == "Backspace" && b.innerText == "backspace") {
              b.classList.add("keyboard__key--viaKeyboard");
              this.properties.value = firstPart.substring(0, firstPart.length - 1) + secondPart;
            } else if (e.code == "Space" && b.innerText == "space_bar") {
              b.classList.add("keyboard__key--viaKeyboard");
              this.properties.value = firstPart + " " + secondPart;
            } else if ( e.code == "ArrowLeft" && b.innerText == "arrow_left" ||
                        e.code == "ArrowRight" && b.innerText == "arrow_right" ||
                        e.key == "/" && b.innerText == "?" ||
                        e.key == b.innerText) {
              b.classList.add("keyboard__key--viaKeyboard");
              this.properties.value = firstPart + b.innerText + secondPart;
            } 
          })
      });

      document.addEventListener("keyup", (e) => {
        body.lastElementChild.firstElementChild.childNodes.forEach( b => {
            if (b.innerText !== "check_circle") {
              b.classList.remove("keyboard__key--viaKeyboard");
            }
        })
      });
    },
  
    _createKeys() {
      const fragment = document.createDocumentFragment();
      const keyLayout = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
        "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
        "audio", "en/ru", "left", "space", "right", "voice", "done"
      ];
  
      // Creates HTML for an icon
      const createIconHTML = (icon_name) => {
        return `<i class="material-icons">${icon_name}</i>`;
      };
  
      keyLayout.forEach(key => {
        const keyElement = document.createElement("button");
        const insertLineBreak = ["backspace", "]", "enter", "?"].indexOf(key) !== -1;
  
        // Add attributes/classes
        keyElement.setAttribute("type", "button");
        keyElement.classList.add("keyboard__key");
  
        switch (key) {
          case "backspace":
            keyElement.classList.add("keyboard__key--wide");
            keyElement.innerHTML = createIconHTML("backspace");
  
            keyElement.addEventListener("click", () => {
              let position = document.querySelector(".use-keyboard-input").selectionStart;
              let firstPart = this.properties.value.slice(0, position);
              let secondPart = this.properties.value.slice(position);

              if (this.properties.audio) {
                if (this.properties.EnRu) {
                  document.querySelector("audio[src='sounds/бакспэйс.mp3']").play();
                } else {
                  document.querySelector("audio[src='sounds/backspase.mp3']").play();
                }
              }

              document.querySelector(".use-keyboard-input").focus();
              this.properties.value = firstPart.substring(0, firstPart.length - 1) + secondPart;
              this._triggerEventBack("oninput");
            });
  
            break;
  
          case "caps":
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
            keyElement.innerHTML = createIconHTML("keyboard_capslock");
  
            keyElement.addEventListener("click", () => {
              document.querySelector(".use-keyboard-input").focus();

              if (this.properties.audio) {
                if (this.properties.EnRu && this.properties.capsLock) {
                  document.querySelector("audio[src='sounds/капс_выкл.mp3']").play();
                } else if (this.properties.EnRu) {
                  document.querySelector("audio[src='sounds/капс.mp3']").play();
                } else if (this.properties.capsLock){
                  document.querySelector("audio[src='sounds/caps_off.mp3']").play();
                } else {
                  document.querySelector("audio[src='sounds/capsLock.mp3']").play();
                }
              }

              this._toggleCapsLock();
              keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
            });
  
            break;
  
          case "enter":
            keyElement.classList.add("keyboard__key--wide");
            keyElement.innerHTML = createIconHTML("keyboard_return");
  
            keyElement.addEventListener("click", () => {
              let position = document.querySelector(".use-keyboard-input").selectionStart;
              let firstPart = this.properties.value.slice(0, position);
              let secondPart = this.properties.value.slice(position);

              if (this.properties.audio) {
                if (this.properties.EnRu) {
                  document.querySelector("audio[src='sounds/новая_строка.mp3']").play();
                } else {
                  document.querySelector("audio[src='sounds/new_line.mp3']").play();
                }
              }

              document.querySelector(".use-keyboard-input").focus();
              this.properties.value = firstPart + "\n" + secondPart;
              this._triggerEvent("oninput");
            });
  
            break;
  
          case "space":
            keyElement.classList.add("keyboard__key--extra-wide");
            keyElement.innerHTML = createIconHTML("space_bar");
  
            keyElement.addEventListener("click", () => {
              let position = document.querySelector(".use-keyboard-input").selectionStart;
              let firstPart = this.properties.value.slice(0, position);
              let secondPart = this.properties.value.slice(position);

              document.querySelector(".use-keyboard-input").focus();
              this.properties.value = firstPart + " " + secondPart;
              this._triggerEvent("oninput");

              if (this.properties.audio) {
                if (this.properties.EnRu) {
                  document.querySelector("audio[src='sounds/пробел.mp3']").play();
                } else {
                  document.querySelector("audio[src='sounds/space_bar.mp3']").play();
                }
              }
            });
  
            break;

          case "shift":
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
            keyElement.innerHTML = createIconHTML("keyboard_control");
            
            keyElement.addEventListener("click", () => {
              document.querySelector(".use-keyboard-input").focus();

              if (this.properties.audio) {
                if (this.properties.EnRu && this.properties.shift) {
                  document.querySelector("audio[src='sounds/шифт_выкл.mp3']").play();
                } else if (this.properties.EnRu) {
                  document.querySelector("audio[src='sounds/шифт_вкл.mp3']").play();
                } else {
                  document.querySelector("audio[src='sounds/shift.mp3']").play();
                }
              }

              this.shiftOn();
              keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
            })
            break;
          
          case "en/ru":
            keyElement.classList.add("keyboard__key--wide");
            keyElement.innerHTML = "EN";

            keyElement.addEventListener("click", () => {
              document.querySelector(".use-keyboard-input").focus();
              this.changeLanguage();
              keyElement.innerHTML = this.properties.EnRu ? "RU": "EN"
              keyElement
              keyElement.classList.toggle(this.properties.EnRu);
              this.defaultSound();
            });

            break;

          case "left":
            keyElement.innerHTML = createIconHTML("arrow_left");
            keyElement.classList.add("arrow");

            keyElement.addEventListener("click", () => {
              document.querySelector(".use-keyboard-input").focus();
              if (document.querySelector(".use-keyboard-input").selectionStart == 0) {
                document.querySelector(".use-keyboard-input").selectionStart = 0;
                document.querySelector(".use-keyboard-input").selectionEnd = document.querySelector(".use-keyboard-input").selectionStart;
              } else {
                document.querySelector(".use-keyboard-input").selectionStart -= 1;
                document.querySelector(".use-keyboard-input").selectionEnd = document.querySelector(".use-keyboard-input").selectionStart;
              }
              this.defaultSound();
            })

            break;

          case "right": 
            keyElement.innerHTML = createIconHTML("arrow_right");
            keyElement.classList.add("arrow");
            
            keyElement.addEventListener("click", () => {
              document.querySelector(".use-keyboard-input").focus();
              document.querySelector(".use-keyboard-input").selectionStart += 1;
              document.querySelector(".use-keyboard-input").selectionEnd = document.querySelector(".use-keyboard-input").selectionStart;
              this.defaultSound();
            })

            break;

          case "done":
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
            keyElement.innerHTML = createIconHTML("check_circle");
  
            keyElement.addEventListener("click", () => {
              this.close();
              this._triggerEvent("onclose");
            });
  
            break;
          
          case "audio":
            keyElement.classList.add("keyboard__key--audio");
            keyElement.innerHTML = createIconHTML("volume_down");

            keyElement.addEventListener("click", () => {
              this.properties.audio = !this.properties.audio;
              keyElement.classList.toggle(this.properties.shift);
              if (!this.properties.audio) {
                keyElement.innerHTML = createIconHTML("volume_off");
              } else {
                keyElement.innerHTML = createIconHTML("volume_down");
              }      
            })

            break;

          case "voice": 
            keyElement.classList.add("keyboard__key--audio");
            keyElement.innerHTML = createIconHTML("mic_off");
            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            let rec = new SpeechRecognition();
            rec.interimResults = true;
            rec.continuous = true;

            keyElement.addEventListener("click", () => {
              rec.lang = this.properties.EnRu ? "ru-RU" : "en-US";
              document.querySelector(".use-keyboard-input").focus();
              this.createAudio(rec);
              keyElement.innerHTML = this.properties.voice ? createIconHTML("mic") : createIconHTML("mic_off");
              keyElement.classList.toggle(this.properties.voice);
              this.defaultSound();
            })

            break;
  
          default:
            keyElement.textContent = key;
  
            keyElement.addEventListener("click", () => {
              let position = document.querySelector(".use-keyboard-input").selectionStart;
              let firstPart = this.properties.value.slice(0, position);
              let secondPart = this.properties.value.slice(position);

              document.querySelector(".use-keyboard-input").focus();
              if (this.properties.capsLock && this.properties.shift) {
                this.properties.value = firstPart + keyElement.textContent.toLowerCase() + secondPart;
              } else if (this.properties.shift) {
                this.properties.value = firstPart + keyElement.textContent.toUpperCase() + secondPart;
              } else if (this.properties.capsLock) {
                this.properties.value = firstPart + keyElement.textContent.toUpperCase() + secondPart;
              }else {
                this.properties.value = firstPart + keyElement.textContent.toLowerCase() + secondPart;
              }
              this.defaultSound();
              
              this._triggerEvent("oninput");
            });
  
            break;
        }
  
        fragment.appendChild(keyElement);
  
        if (insertLineBreak) {
          fragment.appendChild(document.createElement("br"));
        }
      });
  
      return fragment;
    },


    createAudio(rec) {
      this.properties.voice = !this.properties.voice;

      if (this.properties.voice) {
        rec.start();
        rec.addEventListener("result", (e) => {
          let word = document.querySelector(".use-keyboard-input");
          let text = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
          
          word.value = text;
        });
      } else {
        rec.abort();
      }
    },

    defaultSound() {
      if (this.properties.audio) {
        if (this.properties.EnRu) {
          document.querySelector("audio[src='sounds/жмяк.mp3']").play();
        } else {
          document.querySelector("audio[src='sounds/tap.mp3']").play();
        }  
      }
    },

    _triggerEventBack(handlerName) {
      if (typeof this.eventHandlers[handlerName] == "function") {
        let position = document.querySelector(".use-keyboard-input").selectionStart;
        this.eventHandlers[handlerName](this.properties.value);
        if (position > 0) {
          document.querySelector(".use-keyboard-input").selectionEnd = position - 1;
        } else {
          document.querySelector(".use-keyboard-input").selectionStart = 0;
          document.querySelector(".use-keyboard-input").selectionEnd = 0;
        }
      }
    },

    _triggerEvent(handlerName) {
      if (typeof this.eventHandlers[handlerName] == "function") {
        let position = document.querySelector(".use-keyboard-input").selectionStart;
        this.eventHandlers[handlerName](this.properties.value);
        document.querySelector(".use-keyboard-input").selectionEnd = position + 1;
      }
    },
  
    _toggleCapsLock() {
      this.properties.capsLock = !this.properties.capsLock;
  
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0 && key.innerText.length == 1) {
          if (this.properties.shift) {
            key.textContent = this.properties.capsLock ? key.textContent.toLowerCase() : key.textContent.toUpperCase();
          } else {
            key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
          }
        }
      }
    },
  
    open(initialValue, oninput, onclose) {
      this.properties.value = initialValue || "";
      this.eventHandlers.oninput = oninput;
      this.eventHandlers.onclose = onclose;
      this.elements.main.classList.remove("keyboard--hidden");
    },
  
    close() {
      this.properties.value = "";
      this.eventHandlers.oninput = oninput;
      this.eventHandlers.onclose = onclose;
      this.elements.main.classList.add("keyboard--hidden");
    },

    changeLanguage() {
      if (this.properties.shift) this.shiftOn();
      if (this.properties.capsLock) this._toggleCapsLock();
      this.properties.EnRu = !this.properties.EnRu;

      const langEn = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?'];
      const langRu = ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', "э", 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.'];

      document.querySelectorAll("button").forEach(b => {
        b.classList.remove("keyboard__key--active");
        if (this.properties.EnRu) {
          if (langEn.indexOf(b.innerText) > -1) {
            b.innerText = langRu[langEn.indexOf(b.innerText)];
          }
        } else {
          if (langRu.indexOf(b.innerText) > -1) {
            b.innerText = langEn[langRu.indexOf(b.innerText)];
          }
        }
      })
    },

    shiftOn() {
      this.properties.shift = !this.properties.shift;

      const standartItemEn = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "[", "]", ";", "'", ",", ".", "?"];
      const shiftItemEn = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "{", "}", ":", '"', "<", ">", "/"];
      const standartItemRU = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
      const shiftItemRu = ["!", '"', "№", ";", "%", ":", "?", "*", "(", ")", ","];

      document.querySelectorAll("button").forEach(b => {

        if (this.properties.shift && this.properties.EnRu == false) {
          if (b.innerText.charCodeAt(0) > 64 && b.innerText.charCodeAt(0) < 91 && b.innerText.length == 1) {
            b.innerText = b.innerText.toLowerCase();
          } else if (b.innerText.charCodeAt(0) > 96 && b.innerText.charCodeAt(0) < 123 && b.innerText.length == 1) {
            b.innerText = b.innerText.toUpperCase();
          } else if (standartItemEn.indexOf(b.innerText) > -1) {
            b.innerText = shiftItemEn[standartItemEn.indexOf(b.innerText)];
          }
        } else if (this.properties.EnRu == false) {
          if (b.innerText.charCodeAt(0) > 64 && b.innerText.charCodeAt(0) < 91 && b.innerText.length == 1) {
            b.innerText = b.innerText.toLowerCase();
          } else if (b.innerText.charCodeAt(0) > 96 && b.innerText.charCodeAt(0) < 123 && b.innerText.length == 1) {
            b.innerText = b.innerText.toUpperCase();
          } else if (shiftItemEn.indexOf(b.innerText) > -1) {
            b.innerText = standartItemEn[shiftItemEn.indexOf(b.innerText)];
          }
        } else if (this.properties.shift && this.properties.EnRu == true) {
          if (b.innerText.charCodeAt(0) > 1039 && b.innerText.charCodeAt(0) < 1072 && b.innerText.length == 1) {
            b.innerText = b.innerText.toLowerCase();
          } else if (b.innerText.charCodeAt(0) > 1071 && b.innerText.charCodeAt(0) < 1104 && b.innerText.length == 1) {
            b.innerText = b.innerText.toUpperCase();
          } else if (standartItemRU.indexOf(b.innerText) > -1) {
            b.innerText = shiftItemRu[standartItemRU.indexOf(b.innerText)];
          }
        } else {
          if (b.innerText.charCodeAt(0) > 1039 && b.innerText.charCodeAt(0) < 1072 && b.innerText.length == 1) {
            b.innerText = b.innerText.toLowerCase();
          } else if (b.innerText.charCodeAt(0) > 1071 && b.innerText.charCodeAt(0) < 1104 && b.innerText.length == 1) {
            b.innerText = b.innerText.toUpperCase();
          } else if (shiftItemRu.indexOf(b.innerText) > -1) {
            b.innerText = standartItemRU[shiftItemRu.indexOf(b.innerText)];
          }
        }
      })
    }
  };
  
  window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
  });