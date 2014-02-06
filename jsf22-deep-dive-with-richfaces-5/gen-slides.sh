#!/bin/sh

#ASCIIDOCTOR=asciidoctor
ASCIIDOCTOR=~/.rvm/gems/ruby-1.9.3-p448/bin/asciidoctor
BACKEND_TEMPLATES=~/workspaces/awestruct/asciidoctor-backends
TEMPLATE_ENGINE=slim
DECK=slides-devconf2014

if [ "$1" == "pack" ]; then
  PACK=1
fi

if [ ! -z $PACK ]; then
  $ASCIIDOCTOR -b dzslides -a docinfo1 -a linkcss! -a data-uri -T $BACKEND_TEMPLATES/$TEMPLATE_ENGINE -o - $DECK.adoc | sed 's/<\(\/\?html\|\/\?head\|\/\?body\|section\|script\|link\|meta\|title\|style\)/\n&/g' > $DECK-packed.html
else
  # sed is used to prettify the slim output
  $ASCIIDOCTOR -b dzslides -a docinfo1 -T $BACKEND_TEMPLATES/$TEMPLATE_ENGINE -o - $DECK.adoc | sed 's/<\(\/\?html\|\/\?head\|\/\?body\|section\|script\|link\|meta\|title\|style\)/\n&/g' > $DECK.html
fi
