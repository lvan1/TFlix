import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.document = {};

const { applySubtitleOption, getSubtitleOptions } = await import('../mods/subtitles.js');

test('lists only subtitle and caption tracks with useful labels', () => {
  const video = { textTracks: [
    { kind: 'subtitles', label: 'English', language: 'en', mode: 'disabled' },
    { kind: 'captions', label: '', language: 'es', mode: 'disabled' },
    { kind: 'metadata', label: 'Chapters', mode: 'hidden' }
  ] };

  const options = getSubtitleOptions(video);
  assert.deepEqual(options.map(option => option.label), ['English', 'es']);
});

test('selects one subtitle track and disables the others', () => {
  const options = [
    { track: { mode: 'showing' }, label: 'English' },
    { track: { mode: 'disabled' }, label: 'French' }
  ];

  applySubtitleOption(options, 1);
  assert.deepEqual(options.map(option => option.track.mode), ['disabled', 'showing']);

  applySubtitleOption(options, -1);
  assert.deepEqual(options.map(option => option.track.mode), ['disabled', 'disabled']);
});
