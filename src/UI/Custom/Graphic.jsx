import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import classes from "./Graphic.module.css";

const Graphic = ({ data, name, setName }) => {
  const svgRef = useRef();
  const [nameStatistics, setNameStatistics] = useState(name);

  useEffect(() => {
    setNameStatistics(name);
  }, [name]);

  useEffect(() => {
    setName(nameStatistics);
  }, [nameStatistics]);

  useEffect(() => {
    // Размеры графика
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 30, left: 40 };

    // Вычисляем минимальное и максимальное значения
    const minValue = d3.min(data, (d) => d.value);
    const maxValue = d3.max(data, (d) => d.value);

    // Создание масштаба для оси X и Y
    const x = d3
      .scalePoint()
      .domain(data.map((d) => d.valueDate))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([minValue, maxValue])
      .nice() // Округляет границы оси Y
      .range([height - margin.bottom, margin.top]);

    // Создание линии
    const line = d3
      .line()
      .x((d) => x(d.valueDate))
      .y((d) => y(d.value))
      .defined((d) => d.value !== null); // Не рисовать линию, если значение null

    // Удаление старого SVG, если он есть
    d3.select(svgRef.current).selectAll("*").remove();

    // Создание SVG элемента
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Добавление заголовка
    // svg.append('text')
    //   .attr('x', width / 2)
    //   .attr('y', margin.top / 2)
    //   .attr('text-anchor', 'middle')
    //   .style('font-size', '16px')
    //   .style('font-weight', 'bold')
    //   .text(name); // Используем динамический заголовок

    // Добавление сетки за графиком
    const tickValues = data.map((d) => d.valueDate);
    const yTickValues = data.map((d) => d.value); // Значения точек для оси Y

    // Вертикальные линии сетки
    svg
      .selectAll(".grid")
      .data(tickValues)
      .enter()
      .append("line")
      .attr("class", "grid")
      .attr("x1", (d) => x(d))
      .attr("x2", (d) => x(d))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .attr("opacity", 0.7);

    // Горизонтальные линии сетки для значений точек
    svg
      .selectAll(".grid-horizontal")
      .data(yTickValues)
      .enter()
      .append("line")
      .attr("class", "grid-horizontal")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .attr("opacity", 0.7);

    // Добавление осей
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    // Ось Y с делениями, соответствующими значениям точек
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickValues(yTickValues)); // Используем значения точек для оси Y

    // Обработка цвета линии в зависимости от направления
    data.forEach((d, i) => {
      if (i > 0) {
        const prevValue = data[i - 1].value;
        const color = d.value < prevValue ? "red" : "blue"; // Красный, если текущее значение меньше предыдущего

        svg
          .append("path")
          .datum([data[i - 1], d]) // Линия между предыдущей и текущей точкой
          .attr("fill", "none")
          .attr("stroke", color) // Цвет линии
          .attr("stroke-width", 2)
          .attr("d", line);
      }
    });

    // Функция для определения цвета точки в зависимости от значения и направления линии
    const getColor = (value, index) => {
      if (index > 0) {
        const prevValue = data[index - 1].value;
        return value < prevValue ? "red" : "blue"; // Красный, если значение ниже предыдущего
      } else {
        return "green"; // Зеленая точка для первого значения
      }
    };

    // Добавление точек на график
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.valueDate))
      .attr("cy", (d) => y(d.value))
      .attr("r", 5)
      .attr("fill", (d, i) => getColor(d.value, i)) // Используем функцию для получения цвета
      .on("mouseover", (event, d, i) => {
        d3.select(event.currentTarget).attr("r", 7).attr("fill", "orange");

        // Добавляем фон подсказки
        const tooltipGroup = svg
          .append("g")
          .attr("id", "tooltip")
          .attr(
            "transform",
            `translate(${x(d.valueDate)}, ${y(d.value) - 15})`
          );

        tooltipGroup
          .append("rect")
          .attr("x", -30) // Половина ширины прямоугольника
          .attr("y", -25) // Половина высоты прямоугольника
          .attr("width", 60) // Ширина
          .attr("height", 30) // Высота
          .attr("fill", "rgba(0, 0, 0, 0.7)") // Полупрозрачный чёрный фон
          .attr("rx", 4) // Скругление углов
          .attr("ry", 4); // Скругление углов

        tooltipGroup
          .append("text")
          .attr("text-anchor", "middle")
          .attr("y", -5) // Половина высоты прямоугольника
          .text(`(${d.valueDate}, ${d.value})`)
          .style("font-size", "12px")
          .style("fill", "white") // Цвет текста
          .style("font-weight", "bold"); // Жирный шрифт
      })
      .on("mouseout", (event) => {
        const d = d3.select(event.currentTarget).datum(); // Get the data associated with the current target
        const index = data.indexOf(d); // Find the index of that data point
        d3.select(event.currentTarget)
          .attr("r", 5)
          .attr("fill", getColor(d.value, index)); // Use the correct index
        svg.select("#tooltip").remove();
      });
  }, [data]); // Зависимость от data и title для обновления графика при изменении данных и заголовка

  return (
    <div className={classes.block}>
      <input
        type="text"
        value={nameStatistics}
        onChange={(e) => setNameStatistics(e.target.value)}
        className={classes.row1}
      />
      <svg ref={svgRef} className={classes.row2}></svg>
    </div>
  );
};

export default Graphic;
