import { describe, it, expect } from 'vitest';
import request from 'supertest';
import pkg from '../src/index.js';

const { app, mean, median, isValidNumberArray } = pkg;

describe('mean', () => {
  it('calcula el promedio de números positivos', () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3);
  });

  it('funciona con un único número', () => {
    expect(mean([7])).toBe(7);
  });

  it('soporta negativos y decimales', () => {
    expect(mean([-2, 0, 2])).toBe(0);
    expect(mean([1.5, 2.5])).toBe(2);
  });
});

describe('median', () => {
  it('devuelve el valor del medio en arrays de longitud impar', () => {
    expect(median([1, 2, 3])).toBe(2);
    expect(median([5, 1, 3])).toBe(3);
  });

  it('promedia los dos del medio en arrays de longitud par', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it('no muta el array original', () => {
    const input = [3, 1, 2];
    median(input);
    expect(input).toEqual([3, 1, 2]);
  });
});

describe('isValidNumberArray', () => {
  it('rechaza no-arrays', () => {
    expect(isValidNumberArray('hola')).toBe(false);
    expect(isValidNumberArray(null)).toBe(false);
    expect(isValidNumberArray(undefined)).toBe(false);
  });

  it('rechaza arrays vacíos', () => {
    expect(isValidNumberArray([])).toBe(false);
  });

  it('rechaza arrays con valores no numéricos', () => {
    expect(isValidNumberArray([1, '2', 3])).toBe(false);
    expect(isValidNumberArray([1, NaN, 3])).toBe(false);
    expect(isValidNumberArray([1, Infinity])).toBe(false);
  });

  it('acepta arrays de números finitos', () => {
    expect(isValidNumberArray([1, 2, 3])).toBe(true);
    expect(isValidNumberArray([-1, 0.5])).toBe(true);
  });
});

describe('POST /stats', () => {
  it('devuelve estadísticas correctas', async () => {
    const res = await request(app).post('/stats').send({ numbers: [1, 2, 3, 4, 5] });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ mean: 3, max: 5, min: 1, median: 3 });
  });

  it('devuelve 400 si numbers no es un array', async () => {
    const res = await request(app).post('/stats').send({ numbers: 'abc' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('devuelve 400 si el array está vacío', async () => {
    const res = await request(app).post('/stats').send({ numbers: [] });
    expect(res.status).toBe(400);
  });

  it('devuelve 400 si hay valores no numéricos', async () => {
    const res = await request(app).post('/stats').send({ numbers: [1, 'dos', 3] });
    expect(res.status).toBe(400);
  });
});
