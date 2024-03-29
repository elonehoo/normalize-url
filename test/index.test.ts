import { expect, it } from 'vitest'
import normalizeUrl from '../src/index'

it('main', () => {
  expect(normalizeUrl('elonehoo.xyz')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('elonehoo.xyz ')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('elonehoo.xyz.')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('Elonehoo.xyz')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('elonehoo.xyz', { defaultProtocol: 'https:' })).toBe('https://elonehoo.xyz')
  expect(normalizeUrl('HTTP://elonehoo.xyz')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('//elonehoo.xyz')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('http://elonehoo.xyz')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('http://elonehoo.xyz:80')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('https://elonehoo.xyz:443')).toBe('https://elonehoo.xyz')
  expect(normalizeUrl('ftp://elonehoo.xyz:21')).toBe('ftp://elonehoo.xyz')
  expect(normalizeUrl('http://www.elonehoo.xyz:80')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('www.com')).toBe('http://www.com')
  expect(normalizeUrl('http://www.www.elonehoo.xyz')).toBe('http://www.www.elonehoo.xyz')
  expect(normalizeUrl('www.elonehoo.xyz')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('http://elonehoo.xyz/foo/')).toBe('http://elonehoo.xyz/foo')
  expect(normalizeUrl('elonehoo.xyz/?foo=bar baz')).toBe('http://elonehoo.xyz/?foo=bar+baz')
  expect(normalizeUrl('https://foo.com/https://bar.com')).toBe('https://foo.com/https://bar.com')
  expect(normalizeUrl('https://foo.com/https://bar.com/foo//bar')).toBe('https://foo.com/https://bar.com/foo/bar')
  expect(normalizeUrl('https://foo.com/http://bar.com')).toBe('https://foo.com/http://bar.com')
  expect(normalizeUrl('https://foo.com/http://bar.com/foo//bar')).toBe('https://foo.com/http://bar.com/foo/bar')
  expect(normalizeUrl('http://elonehoo.xyz/%7Efoo/')).toBe('http://elonehoo.xyz/~foo')
  expect(normalizeUrl('https://foo.com/%FAIL%/07/94/ca/55.jpg')).toBe('https://foo.com/%FAIL%/07/94/ca/55.jpg')
  expect(normalizeUrl('http://elonehoo.xyz/?')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('êxample.com')).toBe('http://xn--xample-hva.com')
  expect(normalizeUrl('http://elonehoo.xyz/?b=bar&a=foo')).toBe('http://elonehoo.xyz/?a=foo&b=bar')
  expect(normalizeUrl('http://elonehoo.xyz/?foo=bar*|<>:"')).toBe('http://elonehoo.xyz/?foo=bar*|%3C%3E:%22')
  expect(normalizeUrl('http://elonehoo.xyz:5000')).toBe('http://elonehoo.xyz:5000')
  expect(normalizeUrl('//elonehoo.xyz/', { normalizeProtocol: false })).toBe('//elonehoo.xyz')
  expect(normalizeUrl('//elonehoo.xyz:80/', { normalizeProtocol: false })).toBe('//elonehoo.xyz')
  expect(normalizeUrl('http://elonehoo.xyz/foo#bar')).toBe('http://elonehoo.xyz/foo#bar')
  expect(normalizeUrl('http://elonehoo.xyz/foo#bar', { stripHash: true })).toBe('http://elonehoo.xyz/foo')
  expect(normalizeUrl('http://elonehoo.xyz/foo#bar:~:text=hello%20world', { stripHash: true })).toBe('http://elonehoo.xyz/foo')
  expect(normalizeUrl('http://elonehoo.xyz/foo/bar/../baz')).toBe('http://elonehoo.xyz/foo/baz')
  expect(normalizeUrl('http://elonehoo.xyz/foo/bar/./baz')).toBe('http://elonehoo.xyz/foo/bar/baz')
  expect(normalizeUrl('elonehoo://www.elonehoo.com')).toBe('elonehoo://elonehoo.com')
  expect(normalizeUrl('elonehoo://www.elonehoo.com/')).toBe('elonehoo://elonehoo.com')
  expect(normalizeUrl('elonehoo://www.elonehoo.com/foo/bar')).toBe('elonehoo://elonehoo.com/foo/bar')
  expect(normalizeUrl('https://i.vimeocdn.com/filter/overlay?src0=https://i.vimeocdn.com/video/598160082_1280x720.jpg&src1=https://f.vimeocdn.com/images_v6/share/play_icon_overlay.png')).toBe('https://i.vimeocdn.com/filter/overlay?src0=https://i.vimeocdn.com/video/598160082_1280x720.jpg&src1=https://f.vimeocdn.com/images_v6/share/play_icon_overlay.png')
})

it('stripAuthentication option', () => {
  expect(normalizeUrl('http://user:password@www.elonehoo.xyz')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('https://user:password@www.elonehoo.xyz')).toBe('https://elonehoo.xyz')
  expect(normalizeUrl('https://user:password@www.elonehoo.xyz/@user')).toBe('https://elonehoo.xyz/@user')
  expect(normalizeUrl('user:password@elonehoo.xyz')).toBe('http://elonehoo.xyz')
  expect(normalizeUrl('http://user:password@www.êxample.com')).toBe('http://xn--xample-hva.com')
  expect(normalizeUrl('elonehoo://user:password@www.elonehoo.com')).toBe('elonehoo://elonehoo.com')

  const options = { stripAuthentication: false }

  expect(normalizeUrl('http://user:password@www.elonehooelonehoo.com', options)).toBe('http://user:password@elonehooelonehoo.com')
  expect(normalizeUrl('https://user:password@www.elonehoo.com', options)).toBe('https://user:password@elonehoo.com')
  expect(normalizeUrl('https://user:password@www.elonehoo.com/@user', options)).toBe('https://user:password@elonehoo.com/@user')
  expect(normalizeUrl('user:password@elonehoo.com', options)).toBe('http://user:password@elonehoo.com')
  expect(normalizeUrl('http://user:password@www.êxample.com', options)).toBe('http://user:password@xn--xample-hva.com')
  expect(normalizeUrl('elonehoo://user:password@www.elonehoo.com', options)).toBe('elonehoo://user:password@elonehoo.com')
})

it('stripProtocol option', () => {
  const options = { stripProtocol: true }
  expect(normalizeUrl('http://www.elonehoo.com', options)).toBe('elonehoo.com')
  expect(normalizeUrl('http://elonehoo.com', options)).toBe('elonehoo.com')
  expect(normalizeUrl('https://www.elonehoo.com', options)).toBe('elonehoo.com')
  expect(normalizeUrl('//www.elonehoo.com', options)).toBe('elonehoo.com')
  expect(normalizeUrl('elonehoo://user:password@www.elonehoo.com', options)).toBe('elonehoo://elonehoo.com')
  expect(normalizeUrl('elonehoo://www.elonehoo.com', options)).toBe('elonehoo://elonehoo.com')
})
