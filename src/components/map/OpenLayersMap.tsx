import { useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Polygon from 'ol/geom/Polygon'
import LineString from 'ol/geom/LineString'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector'
import { defaults as defaultControls } from 'ol/control/defaults'
import { fromLonLat, toLonLat } from 'ol/proj'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import CircleStyle from 'ol/style/Circle'
import Text from 'ol/style/Text'
import { unByKey } from 'ol/Observable'
import type { Coordinate } from 'ol/coordinate'
import type { EventsKey } from 'ol/events'
import type BaseEvent from 'ol/events/Event'
import 'ol/ol.css'

export interface OpenLayersPoint {
  id: string
  lat: number
  lng: number
  color: string
  label?: string
  emoji?: string
  size?: number
  active?: boolean
  payload?: unknown
}

export interface OpenLayersPolygon {
  id: string
  positions: [number, number][]
  color: string
  fillColor?: string
  fillOpacity?: number
  weight?: number
  dashArray?: string
  payload?: unknown
}

export interface OpenLayersLine {
  id: string
  positions: [number, number][]
  color: string
  width?: number
  dashArray?: string
}

interface OpenLayersMapProps {
  center: [number, number]
  zoom: number
  tileUrl: string
  className?: string
  points?: OpenLayersPoint[]
  polygons?: OpenLayersPolygon[]
  lines?: OpenLayersLine[]
  showZoomControl?: boolean
  animateView?: boolean
  onPointClick?: (point: OpenLayersPoint) => void
  onMapClick?: (lat: number, lng: number) => void
  onReady?: (map: Map) => void
}

function toCoordinate([lat, lng]: [number, number]): Coordinate {
  return fromLonLat([lng, lat])
}

function closeRing(positions: [number, number][]) {
  if (positions.length === 0) {
    return positions
  }

  const [firstLat, firstLng] = positions[0]
  const [lastLat, lastLng] = positions[positions.length - 1]
  if (firstLat === lastLat && firstLng === lastLng) {
    return positions
  }

  return [...positions, positions[0]]
}

function expandTileUrls(url: string) {
  if (!url.includes('{s}')) {
    return [url]
  }

  return ['a', 'b', 'c'].map((subdomain) => url.replace('{s}', subdomain))
}

function dashPattern(dashArray?: string) {
  if (!dashArray) {
    return undefined
  }

  const values = dashArray
    .split(/\s+/)
    .map((value) => Number.parseFloat(value))
    .filter((value) => Number.isFinite(value) && value > 0)

  return values.length > 0 ? values : undefined
}

function createPointStyle(point: OpenLayersPoint) {
  const radius = Math.max(6, Math.round((point.size ?? 22) / 2))
  const baseStyle = new Style({
    image: new CircleStyle({
      radius,
      fill: new Fill({ color: point.color }),
      stroke: new Stroke({ color: '#ffffff', width: 2 }),
    }),
    text: point.emoji
      ? new Text({
          text: point.emoji,
          font: `${point.active ? 15 : 11}px sans-serif`,
          textAlign: 'center',
          textBaseline: 'middle',
        })
      : undefined,
    zIndex: point.active ? 20 : 10,
  })

  if (!point.active) {
    return baseStyle
  }

  return [
    new Style({
      image: new CircleStyle({
        radius: radius + 5,
        fill: new Fill({ color: 'rgba(21, 128, 61, 0.12)' }),
        stroke: new Stroke({ color: '#15803d', width: 2 }),
      }),
      zIndex: 15,
    }),
    baseStyle,
  ]
}

function createPolygonStyle(polygon: OpenLayersPolygon) {
  return new Style({
    stroke: new Stroke({
      color: polygon.color,
      width: polygon.weight ?? 2,
      lineDash: dashPattern(polygon.dashArray),
    }),
    fill: new Fill({
      color: polygon.fillColor
        ? polygon.fillOpacity != null
          ? `${polygon.fillColor}${Math.round(polygon.fillOpacity * 255)
              .toString(16)
              .padStart(2, '0')}`
          : polygon.fillColor
        : 'rgba(21, 128, 61, 0.08)',
    }),
    zIndex: 5,
  })
}

function createLineStyle(line: OpenLayersLine) {
  return new Style({
    stroke: new Stroke({
      color: line.color,
      width: line.width ?? 3,
      lineDash: dashPattern(line.dashArray),
    }),
    zIndex: 8,
  })
}

export function OpenLayersMap({
  center,
  zoom,
  tileUrl,
  className,
  points = [],
  polygons = [],
  lines = [],
  showZoomControl = true,
  animateView = false,
  onPointClick,
  onMapClick,
  onReady,
}: OpenLayersMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const tileLayerRef = useRef<TileLayer<XYZ> | null>(null)
  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return
    }

    const tileLayer = new TileLayer({
      source: new XYZ({
        urls: expandTileUrls(tileUrl),
        crossOrigin: 'anonymous',
      }),
    })

    const vectorLayer = new VectorLayer({
      source: new VectorSource(),
    })

    const map = new Map({
      target: containerRef.current,
      layers: [tileLayer, vectorLayer],
      view: new View({
        center: toCoordinate(center),
        zoom,
      }),
      controls: defaultControls({
        attribution: false,
        rotate: false,
        zoom: showZoomControl,
      }),
    })

    tileLayerRef.current = tileLayer
    vectorLayerRef.current = vectorLayer
    mapRef.current = map
    onReady?.(map)

    const pointerMoveKey: EventsKey = map.on('pointermove', (event) => {
      const target = map.getTargetElement()
      if (!target) {
        return
      }

      const hit = map.hasFeatureAtPixel(event.pixel)
      target.style.cursor = hit ? 'pointer' : ''
    })

    return () => {
      unByKey(pointerMoveKey)
      map.setTarget(undefined)
      mapRef.current = null
      tileLayerRef.current = null
      vectorLayerRef.current = null
    }
  }, [center, onReady, showZoomControl, tileUrl, zoom])

  useEffect(() => {
    const source = tileLayerRef.current?.getSource()
    if (!source) {
      return
    }

    source.setUrls(expandTileUrls(tileUrl))
  }, [tileUrl])

  useEffect(() => {
    const view = mapRef.current?.getView()
    if (!view) {
      return
    }

    const nextCenter = toCoordinate(center)
    if (animateView) {
      view.animate({ center: nextCenter, zoom, duration: 350 })
      return
    }

    view.setCenter(nextCenter)
    view.setZoom(zoom)
  }, [animateView, center, zoom])

  useEffect(() => {
    const source = vectorLayerRef.current?.getSource()
    if (!source) {
      return
    }

    source.clear()

    for (const polygon of polygons) {
      const feature = new Feature({
        geometry: new Polygon([closeRing(polygon.positions).map(toCoordinate)]),
      })
      feature.set('kind', 'polygon')
      feature.set('payload', polygon.payload)
      feature.setStyle(createPolygonStyle(polygon))
      source.addFeature(feature)
    }

    for (const line of lines) {
      const feature = new Feature({
        geometry: new LineString(line.positions.map(toCoordinate)),
      })
      feature.set('kind', 'line')
      feature.setStyle(createLineStyle(line))
      source.addFeature(feature)
    }

    for (const point of points) {
      const feature = new Feature({
        geometry: new Point(toCoordinate([point.lat, point.lng])),
      })
      feature.set('kind', 'point')
      feature.set('payload', point.payload ?? point)
      feature.setStyle(createPointStyle(point))
      source.addFeature(feature)
    }
  }, [lines, points, polygons])

  useEffect(() => {
    const map = mapRef.current
    if (!map || (!onPointClick && !onMapClick)) {
      return
    }

    const clickKey: EventsKey = map.on('singleclick', (event: BaseEvent & { coordinate: Coordinate; pixel: number[] }) => {
      let handled = false

      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        if (feature.get('kind') === 'point' && onPointClick) {
          onPointClick(feature.get('payload') as OpenLayersPoint)
          handled = true
          return true
        }

        return false
      })

      if (handled || !onMapClick) {
        return
      }

      const [lng, lat] = toLonLat(event.coordinate)
      onMapClick(lat, lng)
    })

    return () => unByKey(clickKey)
  }, [onMapClick, onPointClick])

  return <div ref={containerRef} className={className} />
}
