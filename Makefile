SCRIPT_COMPILER = coffee
SCRIPT_COMPILER_OPTS = -bc
SCRIPT_SRC_DIR = scripts
SCRIPT_OUT_DIR = build
SCRIPTS = turtle.coffee L-System.coffee

STYLE_ENGINE = sass
STYLE_SRC_DIR = styles
STYLE_OUT_DIR = dist/css
STYLES = main.sass

LIB_SRC_DIR = libs
LIBS = dat.gui.js underscore.min.js

all: libs scripts

libs: clear_libs $(LIBS)

$(LIBS):
	cat $(LIB_SRC_DIR)/$@ >> $(SCRIPT_OUT_DIR)/libs.js

scripts: $(SCRIPTS)

$(SCRIPTS):
	$(SCRIPT_COMPILER) $(SCRIPT_COMPILER_OPTS) --output $(SCRIPT_OUT_DIR) $(SCRIPT_SRC_DIR)/$@

# cat $(SCRIPT_OUT_DIR)/$(addsuffix .js, $(basename $@)) >> dist/js/scripts.js

clean: clear_scripts

clear_scripts:
	rm -f $(SCRIPT_OUT_DIR)/*.js

clear_libs:
	rm -f $(SCRIPT_OUT_DIR)/libs.js

install:
	bower install

update:
	bower update

.PHONY:
