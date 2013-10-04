#!/usr/bin/python

import cgi
import SOAPpy
import MySQLdb
import json
import urllib2
from xml.dom.minidom import parseString
from os import path

def getUniprotFromAgi(ago):
    con = MySQLdb.connect('localhost', 'hans', 'un1pr0t', 'annotations_lookup')
    cur = con.cursor()
    cur.execute('SELECT uniprot FROM agi_uniprot_lookup WHERE agi=\"' + agi + '\"')
    row = cur.fetchone()
    uniprot = None
    if row:
        uniprot = row[0]
    con.close()
    return uniprot

def getAgiFromUniprot(uniprot):
    con = MySQLdb.connect('localhost', 'hans', 'un1pr0t', 'annotations_lookup')
    cur = con.cursor()
    cur.execute('SELECT agi FROM agi_uniprot_lookup WHERE uniprot=\"' + uniprot + '\"')
    row = cur.fetchone()
    agi = None
    if row:
        agi = row[0]
    con.close()
    return agi

#Reactome RESTful API
def getPathwayDiagram(id, type):
    url = 'http://reactomews.oicr.on.ca:8080/ReactomeRESTfulAPI/RESTfulWS/pathwayDiagram/' + str(id) + '/' + type
    response = urllib2.urlopen(url).read()
    return parseString(response)

#Reactome RESTful API
def queryById(className, id):
    url = 'http://reactomews.oicr.on.ca:8080/ReactomeRESTfulAPI/RESTfulWS/queryById/' + className + '/' + str(id)
    response = urllib2.urlopen(url).read()
    return json.loads(response)

#Reactome RESTful API
def queryEventAncestors(id):
    url = 'http://reactomews.oicr.on.ca:8080/ReactomeRESTfulAPI/RESTfulWS/queryEventAncestors/' + str(id)
    response = urllib2.urlopen(url).read()
    return json.loads(response)[0]['databaseObject']

#Updates an entity with components, members or AGI
def updateEntity(entity):
    _entity = queryById('PhysicalEntity', entity['attributes']['reactomeId'])
    if _entity['schemaClass'] == 'Complex':
        entity['components'] = []
        components = _entity['hasComponent']
        for component in components:
            _component = {}
            _component['attributes'] = {}
            _component['attributes']['reactomeId'] = component['dbId']
            _component = updateEntity(_component)
            entity['components'].append(_component)
    elif _entity['schemaClass'] == 'DefinedSet':
        entity['members'] = []
        members = _entity['hasMember']
        for member in members:
            _member = {}
            _member['attributes'] = {}
            _member['attributes']['reactomeId'] = member['dbId']
            _member = updateEntity(_member)
            entity['members'].append(_member)
    elif _entity['schemaClass'] == 'EntityWithAccessionedSequence':
        uniprot = queryById('PhysicalEntity', _entity['referenceEntity']['dbId'])['identifier']
        entity['attributes']['agi'] = getAgiFromUniprot(uniprot)
    return entity

def objectifyPathwayDiagram(pathwayDiagram):
    children = pathwayDiagram.childNodes[0].childNodes
    obj = {}
    obj['attributes'] = objectifyAttributes(pathwayDiagram.childNodes[0]._attrs)
    for child in children:
        if child.nodeName == 'Properties':
            obj['properties'] = objectifyProperties(child)
        elif child.nodeName == 'Nodes':
            obj['nodes'] = objectifyNodes(child)
        elif child.nodeName == 'Edges':
            obj['edges'] = objectifyEdges(child)
        elif child.nodeName == 'Pathways':
            obj['pathways'] = objectifyPathways(child)
    return obj

def objectifyProperties(properties):
    children = properties.childNodes
    obj = {}
    obj['attributes'] = objectifyAttributes(properties._attrs)
    for child in children:
        if child.nodeName == 'displayName':
            obj['displayName'] = child.childNodes[0].data
    return obj

def objectifyNodes(nodes):
    children = nodes.childNodes
    obj = {}
    obj['attributes'] = objectifyAttributes(nodes._attrs)
    obj['chemicals'] = []
    obj['complexes'] = []
    obj['entities'] = []
    obj['proteins'] = []
    obj['compartments'] = []
    for child in children:
        if child.nodeName == 'org.gk.render.RenderableChemical':
            obj['chemicals'].append(objectifyRenderableChemical(child))
        elif child.nodeName == 'org.gk.render.RenderableComplex':
            obj['complexes'].append(objectifyRenderableComplex(child))
        elif child.nodeName == 'org.gk.render.RenderableEntity':
            obj['entities'].append(objectifyRenderableEntity(child))
        elif child.nodeName == 'org.gk.render.RenderableProtein':
            obj['proteins'].append(objectifyRenderableProtein(child))
        elif child.nodeName == 'org.gk.render.RenderableCompartent':
            obj['compartments'].append(objectifyRenderableCompartment(child))
    return obj

def objectifyEdges(edges):
    children = edges.childNodes
    obj = {}
    obj['attributes'] = objectifyAttributes(edges._attrs)
    obj['reactions'] = []
    for child in children:
        if child.nodeName == 'org.gk.render.RenderableReaction':
            obj['reactions'].append(objectifyRenderableReaction(child))
    return obj

def objectifyPathways(pathways):
    children = pathways.childNodes
    obj = {}
    obj['attributes'] = objectifyAttributes(pathways._attrs)
    return obj

def objectifyRenderableChemical(renderableChemical):
    children = renderableChemical.childNodes
    obj = {}
    obj['attributes'] = objectifyAttributes(renderableChemical._attrs)
    for child in children:
        if child.nodeName == 'Properties':
            obj['properties'] = objectifyProperties(child)
    return obj

def objectifyRenderableComplex(renderableComplex):
    children = renderableComplex.childNodes
    obj = {}
    obj['attributes'] = objectifyAttributes(renderableComplex._attrs)
    for child in children:
        if child.nodeName == 'Properties':
            obj['properties'] = objectifyProperties(child)
    obj = updateEntity(obj)
    return obj

def objectifyRenderableEntity(renderableEntity):
    children = renderableEntity.childNodes
    obj = {}
    obj['attributes'] = objectifyAttributes(renderableEntity._attrs)
    for child in children:
        if child.nodeName == 'Properties':
            obj['properties'] = objectifyProperties(child)
    return obj

def objectifyRenderableProtein(renderableProtein):
    children = renderableProtein.childNodes
    obj = {}
    obj['attributes'] = objectifyAttributes(renderableProtein._attrs)
    for child in children:
        if child.nodeName == 'Properties':
            obj['properties'] = objectifyProperties(child)
    obj = updateEntity(obj)
    return obj

def objectifyRenderableCompartment(renderableCompartment):
    children = renderableCompartment.childNodes
    obj = {}
    obj['attributes'] = objectifyAttributes(renderableCompartment._attrs)
    for child in children:
        if child.nodeName == 'Properties':
            obj['properties'] = objectifyProperties(child)
        elif child.nodeName == 'Components':
            obj['components'] = objectifyComponents(child)
    return obj

def objectifyComponents(components):
    children = components.childNodes
    obj = []
    for child in children:
        if child.nodeName == 'Component':
            obj.append(objectifyAttributes(child._attrs))
    return obj

def objectifyRenderableReaction(renderableReaction):
    children = renderableReaction.childNodes
    obj = {}
    obj['attributes'] = objectifyAttributes(renderableReaction._attrs)
    for child in children:
        if child.nodeName == 'Properties':
            obj['properties'] = objectifyProperties(child)
        elif child.nodeName == 'Inputs':
            obj['inputs'] = objectifyInputs(child)
        elif child.nodeName == 'Outputs':
            obj['outputs'] = objectifyOutputs(child)
        elif child.nodeName == 'Catalysts':
            obj['catalysts'] = objectifyCatalysts(child)
    return obj

def objectifyInputs(inputs):
    children = inputs.childNodes
    obj = []
    for child in children:
        if child.nodeName == 'Input':
            obj.append(objectifyAttributes(child._attrs))
    return obj

def objectifyOutputs(outputs):
    children = outputs.childNodes
    obj = []
    for child in children:
        if child.nodeName == 'Output':
            obj.append(objectifyAttributes(child._attrs))
    return obj

def objectifyCatalysts(catalysts):
    children = catalysts.childNodes
    obj = []
    for child in children:
        if child.nodeName == 'Catalyst':
            obj.append(objectifyAttributes(child._attrs))
    return obj

def objectifyAttributes(attributes):
    obj = {}
    for key in attributes:
        obj[key] = attributes[key].value
    return obj

try:
    #retrieve parameters
    arguments = cgi.FieldStorage()
    agi = arguments['agi'].value

    #output header
    print 'Content-Type: application/json\n'

    #convert agi to uniprot identifier
    uniProtId = getUniprotFromAgi(agi)

    if uniProtId:
        #query Reactome for pathways
        proxy = SOAPpy.WSDL.Proxy('http://www.reactome.org:8080/caBIOWebApp/services/caBIOService?wsdl')
        pathways = proxy.queryPathwaysForReferenceIdentifiers(uniProtId)
        pathwayDiagrams = []
        for p in pathways:
            pathway = queryById('Pathway', p.id)
            pathwayDiagramId = -1
            if pathway['hasDiagram']:
                pathwayDiagramId = pathway['dbId']
            else:
                eventAncestors = queryEventAncestors(pathway['dbId'])
                for e in eventAncestors:
                    if e['hasDiagram']:
                        pathwayDiagramId = e['dbId']
            if pathwayDiagramId > 0:
                if (path.exists('../data/pathway/diagram/' + str(pathwayDiagramId))):
                    rfile = '../data/pathway/diagram/' + str(pathwayDiagramId)
                    fr = open(rfile, 'r')
                    pathwayDiagram = fr.read()
                    fr.close()
                    pathwayDiagrams.append(pathwayDiagram)
                else:
                    pathwayDiagram = json.dumps(objectifyPathwayDiagram(getPathwayDiagram(pathwayDiagramId, 'XML')))
                    wfile = '../data/pathway/diagram/' + str(pathwayDiagramId)
                    fw = open(wfile, 'w')
                    fw.write(pathwayDiagram)
                    fw.close()
                    pathwayDiagrams.append(pathwayDiagram)
        if len(pathways) == 0:
            print '{\"class\": \"ErrorMessage\", \"message\": \"No pathways found.\"}'
        else:
            print '{\"class\": \"PathwayDiagram\", \"data\": [' + ','.join(pathwayDiagrams) + ']}'
    else:
        print '{\"class\": \"ErrorMessage\", \"message\": \"Cannot identify AGI ID.\"}'
except:
    print '{\"class\": \"ErrorMessage\", \"message\": \"Data retrieval failed.\"}'

