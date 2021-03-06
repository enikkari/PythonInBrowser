var app = (function() {
  var editor = document.getElementById("editor");
  var defaultText = "# Welcome to learn Python";
  var code = localStorage.getItem("myCode");
  var user = localStorage.getItem("pythonInBrowserUser") ? localStorage.getItem("pythonInBrowserUser") : null;
  var myCodeMirror;
  var errorMarker;

  initApp();

  /*
   * Initializing functions
   */

  function initApp() {
    initCodeMirror();
    initClickHandlers();
    initLocalSave();
    hideExerciseNavigation();
    disableBackspaceNavigation();
  }

  function initCodeMirror() {
    var extraKeys = {
      Tab: function(cm) {
        if (cm.somethingSelected()) cm.indentSelection("add");
        else CodeMirror.commands.insertSoftTab(cm);
      }
    }

    if(user) {
      $(".name-edit").empty().text(user);
    }

    if(!code) {
      code = defaultText;
    }
    myCodeMirror = CodeMirror(editor, {
      value: code,
      mode:  "python",
      theme: "monokaihighcontrast",
      lineNumbers: true,
      lineWrapping: true,
      tabSize: 2,
      extraKeys: extraKeys,
      autofocus: true
    });
  }

  function initClickHandlers() {
    $(".session-exercises > a > li").on('click', function(event) {
      var type = $(this).data("type");
      var id = $(this).attr("id");
      var session = $(this).data("session");
      var language = $(this).data("language");
      loadCode(type, session, id, language);
    });

    $(".own-exercises").on("click", "a>li>pre", function(event) {
      getCode($(this).parent("li").attr("id"), $(this).parent("li").data("parent"));
    });

    $(".session-header").on("click", function(event) {
        var id = $(this).data("key");
        $(".session-exercises").hide();
        $("#" + id).show();
    });
    $(".name-edit").keypress(function(e){ return e.which != 13; }); //enter disabled in contenteditable

    $("#next-exercise,#prev-exercise").on('click', function(event) {
      var session = $(this).data("session");
      var exercise = $(this).data("exercise");
      var language = $(this).data("language");
      if (session && exercise) {
	loadCode("exercise", session, exercise, language);
      }
    });
  }

  function initLocalSave() {
    setInterval(function(){
      saveLocally();
    },500);
  }

  /*
   * Helper functions
   */
  function outputfunction(text) {
    var mypre = document.getElementById("output");
    mypre.appendChild(document.createTextNode(text));
    $("#output").scrollTop($("#output").prop('scrollHeight'));
  }

  function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
      throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
  }

  function readCode() {
    return myCodeMirror.doc.getValue();
  }

  function setCode(code) {
    $("#mycanvas").empty();
    myCodeMirror.doc.setValue(code);
  }

  function getCode(id, parent) {
    $.get("/api/getSavedForName/" + parent + "/" + id, function(res) {
      if(res && res.data) {
        setCode(res.data.code);
      } else {
        console.log("this failed");
      }
    });
  }

  function loadCode(type, session, id, language) {
    var url;
    if (language) {
      url = "/exercises/" + type + "/" + language + "/" + session + "/" + id;
    } else {
      url = "/exercises/" + type + "/" + session + "/" + id;
    }

    $.get(url, function(data) {
      if(data && data.code) {
        setCode(data.code);
	setupExerciseNavigation(data.nextExercise, data.previousExercise);
      } else {
        console.error("loading code failed for " + session + " ," + id);
      }
    });
  }

  function setupExerciseNavigation(next, prev) {
    setupExerciseNavigationButton("#next-exercise", next);
    setupExerciseNavigationButton("#prev-exercise", prev);
  }

  function setupExerciseNavigationButton(buttonId, target) {
    if (target) {
      setExerciseNavigationTarget(buttonId, target.language, target.session, target.exercise);
      showButton(buttonId);
    } else {
      hideButton(buttonId);
    }
  }

  function setExerciseNavigationTarget(buttonId, language, session, exercise) {
    $(buttonId)
      .data("language", language)
      .data("session", session)
      .data("exercise", exercise);
  }

  function showButton(buttonId) {
    $(buttonId).css("visibility", "visible");
  }

  function hideButton(buttonId) {
    $(buttonId).css("visibility", "hidden");
  }
  
  function hideExerciseNavigation() {
    hideButton("#next-exercise");
    hideButton("#prev-exercise");
  }

  function setErrorHighlight(lineno) {
    errorMarker = myCodeMirror.doc.markText(
      {line: lineno-1, ch: 0},
      {line: lineno-1, ch: 99999},
      {
        className: "cm-error",
        clearOnEnter: true,
        inclusiveLeft: false,
        inclusiveRight: false
      });
  }

  function clearErrorHighlight() {
    if (errorMarker) {
      errorMarker.clear();
      errorMarker = undefined;
    };
  }

  function setErrorMessage(message) {
    outputfunction("\n" + message);
  }

  function saveLocally() {
    localStorage.setItem("myCode", readCode());
  }

  function saveNameLocally(name) {
    localStorage.setItem("pythonInBrowserUser", name);
    $(".name-edit").empty().text(name);
  }

  /*
   * Disable the navigation to the previous page on backspace.
   *
   * Adapted from https://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back
   */
  function disableBackspaceNavigation() {
    $(document).on('keydown', function (event) {
      var doPrevent = false;
      if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ($(d).is(':input')) {
          doPrevent = d.readOnly || d.disabled;
        } else {
          doPrevent = true;
        }
      }

      if (doPrevent) {
        event.preventDefault();
      }
    });
  }

  /*
   * Public functions
   */

  return {
    run: function() {
      $("#mycanvas").empty();
      $("#output").empty();
      clearErrorHighlight();
      var prog = readCode();
      var mypre = document.getElementById("output");
      var width = document.getElementById("mycanvas").offsetWidth;
      var height = document.getElementById("mycanvas").offsetHeight;
      mypre.innerHTML = "";
      Sk.pre = "output";
      Sk.configure({output:outputfunction, read:builtinRead});
      (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = "mycanvas";
      (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).width = width;
      (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).height = height;
      Sk.TurtleGraphics.defaults = {
        canvasID: "mycanvas",
        animate: false,
        degrees: true,
        width: 0,
        height: 0
      };
      Sk.matter = {
        target: "mycanvas",
        width: 600,
        height: 600
      };

      Sk.externalLibraries = {
        matter: {
          path: '/static/modules/matter/__init__.js',
          dependencies: ['/static/modules/matter/matter-0.8.0.min.js']
        },
        tracks: {
          path: '/static/modules/tracks.py'
        },
        coordinates: {
          path: '/static/modules/basic.py'
        },
        turtle2: {
          path: '/static/modules/turtle2.py'
        },
        winter: {
          path: '/static/modules/winter.py'
        },
        talvi: {
          path: '/static/modules/talvi.py'
        },
        datasets: {
          path: '/static/modules/datasets.py'
        }
      };

       var myPromise = Sk.misceval.asyncToPromise(function() {
           return Sk.importMainWithBody("<stdin>", false, prog, true);
       });
       myPromise.then(function(mod) {
          setErrorMessage("");
       },
       function(err) {
         setErrorMessage(err.toString());

         if (err.traceback.length >= 1) {
           setErrorHighlight(err.traceback[err.traceback.length - 1].lineno);
         }

         if (err.traceback.length > 1) {
           var tracebacks = err.traceback.map(function(tb) {
             return tb.filename + " line " + tb.lineno;
           });

           setErrorMessage("Traceback:\n" + tracebacks.join("\n"));
         }
       });
    },

    save: function() {
      var result = $(".name-edit-save").text();
      saveNameLocally(result);
      var data = {"name": result, "code": readCode(), "timestamp": Date.now()};
      $.ajax({
        type: "POST",
        url: "/api/save",
        data: data,
        success: function(msg){
          $(".saved").show().fadeOut(800);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          $(".failed").show().fadeOut(1000);
        }
      });
    },

    load: function() {
      var result = $(".name-edit-load").text();
      saveNameLocally(result);
      $(".own-exercises").empty();
      var options = {
        weekday: "long", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit"
      };
      if(result && result.length > 1) {
        $.get("/api/getSaved/" + result, function(res) {
          if(res && res.data) {
            _.each(res.data, function(item) {
              var date = new Date(parseInt(item.timestamp, 10)).toLocaleDateString("en-us", options);
              $(".own-exercises").append("<a href='#close'><li id=" +  item.timestamp + " data-parent=" + result + "><div class='date'>" + date + "</div><pre>" + item.code + "</pre></li></a>");
            });
          } else {
            $(".empty-exercises").show().fadeOut(1000);
          }
        });
      }
    }
  };
})();

function run() {
  return app.run();
}

function load() {
  return app.load();
}

function save() {
  return app.save();
}
