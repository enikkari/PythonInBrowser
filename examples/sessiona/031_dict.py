################################################
## DICTIONARY, eli "hakemisto"


################################################
## DICT (aka dict())
##
## on yksi Pythonin datastruktuureista.
## Se on niin yleinen, että silläkin on oma luontitapa:

hakemisto = {
    'avain1': 'arvo1',
    'avain2': 2,
    'avain3': u'tämä stringi on avaimen3 takana oleva arvo (eli value)'
}

## Dict on joukko(!) avaimia (key),
## ja niihin liittyviä arvoja (value).

## Näin homma toimii:

#print hakemisto["avain1"], u" <- tuossa on 'keyn' takana oleva 'value'."
#print u"Näin saat kaikki dict:in avaimet:"
#print hakemisto.keys()
#print ""
#print u"Tässä printattuna koko dict:"
#print hakemisto

## Uuden key:valuen lisääminen:

#hakemisto["uusiavain"] = u"jotain dataa, vaikkapa tälläinen stringi"
#print hakemisto["uusiavain"]

## key:valuen poistaminen:

#hakemisto.pop("uusiavain", None)
#print hakemisto["uusiavain"]  # tästä tulee virhe



################################################
## FOR-LOOPPI DICTIN KANSSA
##
## Pelkkä for käy läpi vain avaimet:

#for asia in hakemisto:
#    print asia

## Tämä on tapa käydä läpi avaimet ja arvot:

#for key, value in hakemisto.items():
#    print key, " : ", value


